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
const auditTrailMiddleware = (actionType) => async (req, res, next) => {
  const { email, username } = req.session?.user || {}
  const response = await knexInstance('auditTrail').insert({
    id: v4(),
    user_email: email,
    user_username: username,
    action_type: actionType,
    timestamp: Date.now(),
  })
  next()
}
app.use('/users', userRoutes)

app.get('/checkLoggedUser', auditTrailMiddleware('CHECK_LOGGED_USER'), (req, res) => {
  try {
    const user = req.session.user
    if (user) {
      res.send('logado')
    } else {
      res.send('deslogado')
    }
  } catch (error) {
    throw new Error(error.message)
  }
})

app.post('/login', auditTrailMiddleware('USER_LOGGED'), asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await knexInstance('users').where({ email, password });

    if (user.length > 0) {
      req.session.user = user[0];
      res.json({ user: user[0], sessionId: req.sessionID })
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}));

app.get('/logout', auditTrailMiddleware('LOGOUT_USER'), asyncHandler(async (req, res) => {
  try {
    req.session.user = null
    res.json({ message: 'Logout success' })
  } catch (error) {
    throw new Error(error.message)
  }
}))

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ error: err })
  } else {
    next()
  }
})

const PORT = 5000
app.listen(PORT, () => console.log('Rodando...'))