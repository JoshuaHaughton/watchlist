const express = require('express');

const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json('hello')
})


app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))