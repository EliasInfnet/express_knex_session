import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { v4 as uuidV4 } from 'uuid'
import users from './mock/users.js'
import { userRoutes } from './routes/index.js'
import asyncHandler from 'express-async-handler'
import { knexInstance } from './config/knexfile.js'

const app = express()
const allowedOrigin = 'http://localhost:5173'; // Replace with your client's origin

app.use(cors({
  origin: allowedOrigin,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true, // Allow credentials (cookies)
}));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));


app.use(express.json())
app.use('/users', userRoutes)

app.get('/checkLoggedUser', (req, res) => {
  try {
    const user = req.session.user
    if (user) {
      res.json(user)
    } else {
      res.json({
        message: 'user not logged',
        sessionId: req.sessionID,
        session: {
          ...req.session
        },
      })
    }
  } catch (error) {
    throw new Error(error.message)
  }
})

app.post('/login', asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await knexInstance('users').where({ email, password });

    if (user.length > 0) {
      req.session.user = user[0];
      req.session.save(() => {
        console.log('saved')
      })
      res.json({ user: user[0], sessionId: req.sessionID })
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}));

app.get('/logout', asyncHandler(async (req, res) => {
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