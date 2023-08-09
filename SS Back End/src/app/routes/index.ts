import { Router } from 'express'
import apis from './apis'
import express from 'express'
import path from 'path'

const app = Router()


//serve static react build on home route

app.use('/api', apis)
app.use('/', express.static('build'));
app.get('*', (req, res) => {
res.sendFile(path.resolve( 'build', 'index.html'));
});







export default app
