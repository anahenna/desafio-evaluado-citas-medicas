import express from 'express';
import { engine } from 'express-handlebars';
import chalk from 'chalk';
import { nanoid } from 'nanoid';
import moment from 'moment';
import 'moment/locale/es.js';
import axios from 'axios';
import _ from 'lodash';


const app  = express()

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

const users = []
app.get('/', async (req, res) => {

    const response = await axios.get('https://randomuser.me/api/');
    const gender = response.data.results[0].gender;
    const first = response.data.results[0].name.first;
    const last = response.data.results[0].name.last;
    const user = {
        gender, 
        first, 
        last,
        id: nanoid(),
        timestamp: moment().format('lll')
    };
  
    users.push(user);
    const [femaleUsers, maleUsers] = _.partition(users, { 'gender': 'female' });

    console.log(chalk.bgWhite.blue('Female Users:'));
    femaleUsers.forEach(user =>{
        console.log(chalk.blue(`${user.first} - ${user.last} - ${user.id} - ${user.timestamp}`));
    });
    console.log(chalk.bgWhite.blue('Male Users:'));
    maleUsers.forEach(user =>{
        console.log(chalk.blue(`${user.first} - ${user.last} - ${user.id} - ${user.timestamp}`));
    });



    res.render('home', { femaleUsers, maleUsers });
  });

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor encendido http://localhost:${PORT}`));