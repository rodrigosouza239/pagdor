import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ChartOptions, ChartType, ChartDataSets, ChartLineOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Router } from '@angular/router';
import { Response } from 'src/app/models/response';
import { Screenshot } from '@ionic-native/screenshot/ngx';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit, AfterViewInit {
  screen: any;
  state: boolean = false;  
  responses: Response[] = [];
  lineChartLabels: Label[] = [];
  lineChartType = 'line';
  lineChartLegend = true;
  lineChartPlugins = [];
  barChartLegend = true;
  barChartPlugins = [pluginAnnotations];
  lineChartData: ChartDataSets[];
  colorChart = [
          {
              backgroundColor: 'rgb(0, 178, 255)',
              borderColor: 'rgb(100,149,237)',
              pointBackgroundColor: 'rgb(0, 178, 255)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(0, 178, 255)',
          }
      ];
  lineChartOptions = {
      elements: {
          line: {
              tension: 0,
              fill: false
          },
      },
      scales: {
          yAxes: [{
                  scaleLabel: {
                      display: true,
                      labelString: 'Acompanhe sua dor em porcentagem'
                  },
                  ticks: {
                      beginAtZero: true,
                      max: 100,
                      min: 0,
                      stepSize: 50,
                      callback: function (value, index, values) {
                          return value + '%';
                      }
                  }
              }]
      },
      tooltips: {
          enabled: false,
      },
      annotation: {
          annotations: [
              {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: '0',
                  borderColor: 'green',
                  borderWidth: 1
              },
              {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: '50',
                  borderColor: 'gray',
                  borderWidth: 1
              },
              {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: '100',
                  borderColor: 'red',
                  borderWidth: 2
              },
          ],
      },
  };

  constructor(private storage: Storage, private router: Router,private screenshot: Screenshot) { }

  ngOnInit() {
  }

  myRandom(min, max, multiple) {
    return Math.round(Math.random() * (max - min) / multiple) * multiple + min;
  }

  reset() {
    var self = this;
    setTimeout(function(){ 
      self.state = false;
    }, 1000);
  }


  screenShot() {
    this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(res => {
        this.screen = res.filePath;
        this.state = true;
        this.reset();
      });
  }
  
  ngAfterViewInit() {
      setTimeout(()=> {
          this.getLineChart();
      }, 150);
  }

  async getLineChart() {
    this.responses = JSON.parse(await this.storage.get('responses'));
    let responses = [];

    for (let i = 0; i < this.responses.length; i++) {
        this.lineChartLabels.push((i + 1) + "ª");
        responses.push(this.responses[i].value);
    }
    this.lineChartData = [{ data: responses, label: 'Acompanhe a evolução da sua dor' }];
  }

  confirm() {
      this.router.navigateByUrl("/home");
  }

  logout(){
    navigator['app'].exitApp();
  }

}
