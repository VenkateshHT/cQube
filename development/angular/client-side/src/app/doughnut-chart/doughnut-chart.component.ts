import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '../data';
import { Chart } from 'chart.js';  

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {
  data: Data[];  
  url = 'http://localhost:8089/s3data';  
  label = [];  
  value = [];  
  douguhnutchart = [];  
  constructor(private http: HttpClient) { }  
  ngOnInit() {  
    this.http.get(this.url).subscribe((result: Data[]) => {  
      result.forEach(x => {  
        this.label.push(x.label);  
        this.value.push(x.value);  
      });  
      this  
      this.douguhnutchart = new Chart('doughnut', {  
        type: 'doughnut',  
        data: {  
          labels: this.label ,  
          datasets: [  
            {  
              label: 'DefaultLabel',
              data: this.value,  
              borderColor: '#3cba9f',  
              backgroundColor: [  
                "#3cb371",  
                "#0000FF",  
                "#9966FF",  
                "#4C4CFF",  
                "#00FFFF",  
                "#f990a7",  
                "#aad2ed",  
                "#FF00FF",  
                "Blue"  
                 
                  
              ],  
              fill: true 
            }  
          ]  
        },  
        options: { 
          title:{
            display: true,
            text: "NO. OF STUDENTS PRESENT"
          } ,
          legend: {  
            position:'right',
          },
          animation:{
            animateScale:true,
            animateRotate:true

          },
            display: true  
          },ticks: {
            beginAtZero: true
        },  
          scales: {  
            xAxes: [{  
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'SCHOOL NAME'
              }  
            }],  
            yAxes: [{  
              display: true ,
              scaleLabel: {
                display: true,
                labelString: 'NO. OF DAYS PRESENT'
              }
            },
          ],  
          }  
        }  
      );  
    });  
  }
 

}
