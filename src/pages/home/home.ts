import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TodosProvider } from '../../providers/todos/todos';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private todos: any;

  constructor(public navCtrl: NavController, public todoService: TodosProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.todoService.getTodos().then((data) => {
      this.todos = data;
    });
  }

  createTodo() {
    let prompt = this.alertCtrl.create({
      title: 'Adicionar',
      message: 'O que você precisa fazer?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.todoService.createTodo(data);
          }
        }
      ]
    });

    prompt.present();
  }

  updateTodo(todo: any) {

    let prompt = this.alertCtrl.create({
      title: 'Editar',
      message: 'Mudou de idéia?',
      inputs: [{
        name: 'title'
      }],
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Salvar',
          handler: data => {
            this.todoService.updateTodo({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  deleteTodo(todo: any) {
    this.todoService.deleteTodo(todo);
  }
}
