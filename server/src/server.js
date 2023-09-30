import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { userRoutes } from './routes/index.js'
import asyncHandler from 'express-async-handler'
import { knexInstance } from './config/knexfile.js'
import connectSessionKnex from 'connect-session-knex'
import { v4, v5 } from 'uuid'

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    // Check if the origin is allowed
    if (!origin) {
      // If there's no origin, allow the request
      callback(null, true);
    } else {
      // Check if the origin is allowed (you can implement your own logic here)
      // For this example, we allow all origins with credentials
      callback(null, true);
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true, // Allow credentials (cookies)
}));

const KnexSessionStore = connectSessionKnex(session);
const sessionStore = new KnexSessionStore({ knex: knexInstance });

app.use(session({
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
  secret: 'keyboard cat',
  cookie: {
    maxAge: 5000
  }
}));

app.use(express.json())

const auditTrailMiddleware = async (req, res) => {
  const { email, username } = req.session?.user || {}
  const { resInfo, actionType } = req.auditTrailInfo || {}
  const response = await knexInstance('auditTrail').insert({
    id: v4(),
    user_email: email,
    user_username: username,
    action_type: actionType,
    timestamp: Date.now(),
  })
  res.send(resInfo)
}

app.use('/users', userRoutes)

app.get('/checkLoggedUser', (req, res, next) => {
  try {
    const user = req.session.user
    if (user) {
      req.auditTrailInfo = {
        resInfo: 'logado',
        actionType: 'CHECK_LOGGED_USER'
      }
      next()
    } else {
      req.auditTrailInfo = {
        resInfo: 'deslogado',
        actionType: 'CHECK_LOGGED_USER'
      }
      next()
    }
  } catch (error) {
    throw new Error(error.message)
  }
}, auditTrailMiddleware)

app.post('/login', asyncHandler(async (req, res,next) => {
  try {
    const { email, password } = req.body;
    const user = await knexInstance('users').where({ email, password });
    if (user.length > 0) {
      req.session.user = user[0];
      req.auditTrailInfo = {
        resInfo: { user: user[0], sessionId: req.sessionID },
        actionType: 'LOGGED_USER'
      }
      next()
    } else {
      req.auditTrailInfo = {
        resInfo: { message: 'Invalid credentials' },
        actionType: 'LOGIN_ATTEMPT_FAIL'
      }
      next()
    }
  } catch (error) {
    throw new Error(error.message);
  }
}), auditTrailMiddleware);

app.get('/logout', asyncHandler(async (req, res,next) => {
  try {
    req.session.user = null
    req.auditTrailInfo = {
      resInfo: { message: 'Logout success' },
      actionType: 'USER_LOGOUT'
    }
    next()
  } catch (error) {
    throw new Error(error.message)
  }
}), auditTrailMiddleware)

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ error: err })
  } else {
    next()
  }
})

const PORT = 5000
app.listen(PORT, () => console.log('Rodando...'))