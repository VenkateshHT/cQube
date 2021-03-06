import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AppServiceComponent } from '../app.service';
import { KeycloakSecurityService } from '../keycloak-security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //tooltip texts::::::::::::::
  imrTooltip = "This geo-location-based dashboard provides insights on school infrastructure access across Gujarat.";
  crTooltip = "This dashboard allows users to correlate various available metrics on school infrastructure data using a combined visualisation of the scatter plot and table.";
  udiseTooltip = "This geo-location dashboard converts data available in UDISE into actionable indices that can be visualised at various administrative levels across Gujarat";
  compositeTooltip = "This dashboard brings metrics from other dashboards and allows users to correlate various metrics among each other.";
  dscTooltip = "This dashboard provides insights on grade and subject-wise consumption of TPD courses broken by user type.";
  dccTooltip = "This dashboard provides insight on district-wise usage of TPD courses";
  utTooltip = "This dashboard provides insights on district-wise usage of ETB";
  dtrTooltip = "This dashboard provides insights on total usage at the course content level.";
  utcTooltip = " This dashboard provides insights on the total usage at the ETB content level.";
  crcrTooltip = "This dashboard allows users to correlate various available metrics calculated from the CRC visit data using a combined visualisation of the scatter plot and table.";
  srTooltip = "This geo-location-based dashboard provides insights on student semester performance across Gujarat.";
  patTooltip = " This geo-location-based dashboard provides insights on student Periodic Assessment Test (PAT) performance across Gujarat.";
  semExpTooltip = "This geo-location-based dashboard provides insights on those schools that did not upload their semester scores.";
  isdataTooltip = "This dashboard allows you to download exception reports for the different dashboards available on cQube";
  sarTooltip = "This geo-location-based dashboard provides insights on Student Attendance across Gujarat.";
  tarTooltip = "This geo-location-based dashboard provides insights on Teacher Attendance across Gujarat ";
  telemDataTooltip = "This dashboard provides insights on usage statistics for cQube";
  heatChartTooltip = "This dashboard provides insights on student performance at the question level.";
  lotableTooltip = "This dashboard provides insights on student performance at the learning outcome level.";
  tpdtpTooltip = "This dashboard provides details on district-wise TPD course enrolment progress broken at the individual course level.";
  tpdcpTooltip = "This dashboard provides details on district-wise TPD course progress broken at the individual course level.";

  hiddenPass = false;
  edate: Date;
  telemetryData = [];
  timePeriod;

  imrViews;
  crViews;
  udiseViews;
  compositeViews;
  dscViews;
  dccViews;
  utViews;
  dtrViews;
  utcViews;
  crcrViews;
  srViews;
  patViews;
  semExpViews;
  isdataViews;
  sarViews;
  tarViews;
  telemDataViews;
  heatChartViews;
  lotableViews;
  tpdtpViews;
  tpdcpViews;

  constructor(private router: Router, private service: AppServiceComponent, public keyCloakService: KeycloakSecurityService) {
    service.logoutOnTokenExpire();
  }
  ngOnInit() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('homeBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'block';
    if (localStorage.getItem('roleName') == "admin") {
      this.hiddenPass = false;
    } else {
      this.hiddenPass = true;
    }
    this.callOnInterval();
    setInterval(() => {
      this.callOnInterval();
    }, 30000);
  }

  callOnInterval() {
    this.getViews24hrs();
    setTimeout(() => {
      this.getViews7days();
    }, 10000);
    setTimeout(() => {
      this.getViews30days();
    }, 20000);
  }

  fetchTelemetry(event, report) {
    this.service.getTelemetryData(report, event.type);
    document.getElementById('homeBtn').style.display = 'block';
    document.getElementById('backBtn').style.display = 'none';
    this.service.homeControl();
  }

  getViews24hrs() {
    this.service.getTelemetry('last_day').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  getViews7days() {
    this.service.getTelemetry('last_7_days').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  getViews30days() {
    this.service.getTelemetry('last_30_days').subscribe(res => {
      this.telemetryData = res['telemetryData'];
      this.assignViews(this.telemetryData);
    })
  }

  assignViews(views) {
    this.imrViews = "";
    this.crViews = "";
    this.udiseViews = "";
    this.compositeViews = "";
    this.dscViews = "";
    this.dccViews = "";
    this.utViews = "";
    this.dtrViews = "";
    this.utcViews = "";
    this.crcrViews = "";
    this.srViews = "";
    this.patViews = "";
    this.semExpViews = "";
    this.isdataViews = "";
    this.sarViews = "";
    this.tarViews = "";
    this.telemDataViews = "";
    this.heatChartViews = "";
    this.lotableViews = "";
    this.tpdcpViews = "";
    this.tpdtpViews = "";

    var myStr = this.removeUnderscore(views[0].time_range);
    this.timePeriod = " (" + myStr + ")";

    views.forEach(element => {
      let timeStr = this.removeUnderscore(element.time_range);
      if (element.reportid == 'imr') {
        this.imrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'cr') {
        this.crViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'udise') {
        this.udiseViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'composite') {
        this.compositeViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dsc') {
        this.dscViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dcc') {
        this.dccViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'ut') {
        this.utViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'dtr') {
        this.dtrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'utc') {
        this.utcViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'crcr') {
        this.crcrViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'sr') {
        this.srViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'pat') {
        this.patViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'SemExp') {
        this.semExpViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'isdata') {
        this.isdataViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'sar') {
        this.sarViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tar') {
        this.tarViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'telemData') {
        this.telemDataViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'heatChart') {
        this.heatChartViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'lotable') {
        this.lotableViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tpd-cp') {
        this.tpdcpViews = element.number_of_views + " (" + timeStr + ")";
      }
      if (element.reportid == 'tpd-tp') {
        this.tpdtpViews = element.number_of_views + " (" + timeStr + ")";
      }

    });
  }

  removeUnderscore(data) {
    var mydata = data.replace(/_/g, ' ');
    var myStr = mydata.charAt(0).toUpperCase() + mydata.substr(1).toLowerCase();
    return myStr;
  }


}
