const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


const users = [
  { id: 1, email: 'test@sunbasedata.com', password: 'Test@123' }
];

app.post('/login', (req, res) => {
  const { login_id, password } = req.body;

  const user = users.find(u => u.email === login_id && u.password === password);

  if (user) {
    res.status(200).json({ message: 'Authentication successful', token: 'your_generated_token_here' });
  } else {
    res.status(401).json({ message: 'Authentication failed. Invalid credentials.' });
  }
});

app.get('/customerList', async (req, res) => {
  try {
    const token = 'dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=';
    const response = await fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer list');
    }
    const customerData = await response.json();
    res.status(200).json(customerData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch customer list' });
  }
});


app.post('/createCustomer', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const { first_name, last_name, street, address, city, state, email, phone } = req.body;

    if (!first_name || !last_name) {
      res.status(400).send('First Name or Last Name is missing');
    } else {
      res.status(201).send('Successfully Created');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Failed to create customer');
  }
});


app.post('/deleteCustomer', (req, res) => {
  const { cmd, uuid } = req.body;
  if (cmd === 'delete') {
    res.status(200).json({ message: 'Customer successfully deleted.' });
  } else {
    res.status(400).json({ message: 'Invalid command.' });
  }
});

app.post('/updateCustomer', (req, res) => {
  const { cmd, uuid, first_name, last_name, street, address, city, state, email, phone } = req.body;

  if (!cmd || !uuid || !first_name || !last_name || !street || !address || !city || !state || !email || !phone) {
    return res.status(400).json({ error: 'Body is Empty' });
  }

  if (uuid === 'exampleUUID123') {
    return res.status(200).json({ message: 'Successfully Updated' });
  } else {
    return res.status(500).json({ error: 'UUID not found' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
