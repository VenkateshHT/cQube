import { Component, OnInit } from '@angular/core';
import { NifiShedularService } from '../../services/nifi-shedular.service';
declare const $;

@Component({
  selector: 'app-nifi-shedular',
  templateUrl: './nifi-shedular.component.html',
  styleUrls: ['./nifi-shedular.component.css']
})
export class NifiShedularComponent implements OnInit {
  result: any = [];
  data: any = [];
  user_status = 1;
  err;
  msg;
  showMsg;
  timeArr = [];
  selectedTime = [];
  selectedShedule = '';
  selectMin = '';
  hoursArr = [];
  minsArr = [];
  selectedHour = [];
  selectedMinuts = [];
  selectedDuration = '';
  processorId;
  constructor(private service: NifiShedularService) {
    for (let i = 1; i <= 10; i++) {
      this.hoursArr.push({ hours: i });
    }
    for (let i = 0; i < 60; i++) {
      this.minsArr.push({ mins: `${("0" + (i)).slice(-2)}` });
    }
  }

  ngOnInit(): void {
    document.getElementById('backBtn').style.display = "none";
    this.showTable();
    document.getElementById('homeBtn').style.display = "Block";
    //get 24 hours time
    var date, array = [];
    date = new Date();

    while (date.getMinutes() % 60 !== 0) {
      date.setMinutes(date.getMinutes() + 1);
    }
    for (var i = 0; i < 24; i++) {
      array.push({ time: ("0" + (date.getHours())).slice(-2) });
      date.setMinutes(date.getMinutes() + 60);
    }
    array.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));

    this.timeArr = array;
  }

  onSelectTime(i) {
    this.selectedShedule = this.selectedTime[i];
  }

  onSelectMinutes(i) {
    this.selectMin = this.selectedMinuts[i];
  }

  onSelectHour(i) {
    this.selectedDuration = this.selectedHour[i];
  }

  showTable() {
    document.getElementById('spinner').style.display = 'block';
    if (this.result.length! > 0) {
      $('#table').DataTable().destroy();
    }
    this.service.nifiGetProcessorId().subscribe(res => {
      this.processorId = res['processorId'];
      this.service.nifiGetProcessorDetails(this.processorId).subscribe(details => {
        this.result = details;
        this.data = this.result;

        $(document).ready(function () {
          $('#table').DataTable({
            destroy: true, bLengthChange: false, bInfo: false,
            bPaginate: false, scrollY: 380, scrollX: true,
            scrollCollapse: true, paging: false, searching: true,
            fixedColumns: {
              leftColumns: 1
            }
          });
        });
        document.getElementById('spinner').style.display = 'none';
      });
    })
  }

  onClickSchedule(data) {
    if (this.selectedDuration != '' && this.selectedShedule != '') {
      this.service.nifiScheduleProcessor(data.id, { state: "RUNNING", time: { hours: this.selectedShedule, minutes: this.selectMin }, stopTime: this.selectedDuration }).subscribe(res => {
        if (res['msg']) {
          this.msg = res['msg'];
          this.err = '';
          document.getElementById('success').style.display = "block";
          this.selectedTime = [];
          this.selectedHour = [];
          this.selectedMinuts = [];
          this.selectedShedule = '';
          this.selectMin = '';
          this.selectedDuration = '';
          setTimeout(() => {
            document.getElementById('success').style.display = "none";
          }, 2000);
        }
      }, err => {
        this.err = err.error['errMsg'];
      })
    } else if (this.selectedDuration == '' && this.selectedShedule == '') {
      this.err = "please select schedule time and stopping hours";
    } else if (this.selectedShedule == '') {
      this.err = "please select schedule time";
    } else if (this.selectedDuration == '') {
      this.err = "please select stopping hours";
    }


  }
}
