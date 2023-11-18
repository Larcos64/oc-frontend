import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  breadcrumb = new Array();

  constructor() { }

  ngOnInit() {
    this.breadcrumb = [
      { url: '/home/homePage', name: 'Inicio' },
      { url: '', name: 'Home' },
    ];
  }

}
