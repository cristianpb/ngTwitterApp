// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';

//importing Hero classes
import { MessageRepository } from './repositories/MessageRepository'
import { Message } from './entities/message';

// creating a function that execute self runs
(async () => {
    // connecting at mongoClient
  const connection = await MongoClient.connect('mongodb://localhost');
  const db = connection.db('warriors');
    
  const repository = new MessageRepository(db, 'messages');

  //CREATE
  //const message = new Message( 'iiiiiii', 12, '01');
  //const result = await repository.create(message);
  //console.log(`message inserted with ${result ? 'success' : 'fail'}`)

  const result = await repository.create(new Message());
  const count = await repository.countMessages();
  console.log(`the count of spartans is ${count}`)

  const messageSear = new Message('', 1);
  var mess = await repository.find(messageSear)
  console.log(mess)

  connection.close()

  //    // our operations
  //    // creating a spartan
  //    const spartan = new Spartan('Leonidas', 1020);
  //
  //    // initializing the repository
  //    const repository = new SpartanRepository(db, 'spartans');
  //
  //    // call create method from generic repository
  //    const result = await repository.create(spartan);
  //    console.log(`spartan inserted with ${result ? 'success' : 'fail'}`)
  //
  //    //call specific method from spartan class
  //    const count = await repository.countOfSpartans();
  //    console.log(`the count of spartans is ${count}`)
  //
  //    /**
  //     * spartan inserted with success
  //      the count of spartans is 1
  //     */
  //
  //    const hero = new Hero('Spider Man', 200);
  //    const repositoryHero = new HeroRepository(db, 'heroes');
  //    const resultHero = await repositoryHero.create(hero);
  //    console.log(`hero inserted with ${result ? 'success' : 'fail'}`)

})();
