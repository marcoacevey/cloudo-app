import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

/*
  Generated class for the TodosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodosProvider {

  data: Array<any>;
  db: any;
  remote: any;

  constructor(/*public http: Http*/) {
    console.log('Hello contrutor');

    this.db = new PouchDB('cloudo');

    //this.remote = 'http://localhost:5984/cloudo';
    this.remote = 'http://192.168.0.175:5984/cloudo';
    //this.remote = 'http://desktop-bk11tps:5984/cloudo';
   

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  getTodos() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({

        include_docs: true

      }).then((result) => {

        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db
          .changes({ live: true, since: 'now', include_docs: true })
          .on('change', (change) => {
            this.handleChantge(change);
          });

      }).catch((error) => {
        console.log(error);
      });
    });
  }

  createTodo(todo: any) {
    this.db.post(todo);
  }

  updateTodo(todo: any) {
    this.db.put(todo).catch((error) => {
      console.log(error);
    });
  }

  deleteTodo(todo: any) {
    this.db.remove(todo).catch((error) => {
      console.log(error);
    });
  }

  handleChantge(change: any) {

    console.log('mudou:', change);

    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }

    });

    // A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    } else {
      // A document as updated
      if (changedDoc) {
        this.data[changedIndex] = change.doc;
      }
      // a document was added
      else {
        this.data.push(change.doc);
      }
    }
  }
}
