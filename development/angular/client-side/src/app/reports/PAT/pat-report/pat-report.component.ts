import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatReportService } from '../../../services/pat-report.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import * as R from 'leaflet-responsive-popup';
import { AppServiceComponent, globalMap } from '../../../app.service';

@Component({
  selector: 'app-pat-report',
  templateUrl: './pat-report.component.html',
  styleUrls: ['./pat-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PATReportComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public colors: any;
  public setColor: any;

  // to assign the count of below values to show in the UI footer
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';

  // to hide and show the hierarchy details
  public skul: boolean = false;
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;

  // to hide the blocks and cluster dropdowns
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  subjectHidden: boolean = true;

  // to set the hierarchy names
  public districtHierarchy: any = '';
  public blockHierarchy: any = '';
  public clusterHierarchy: any = '';

  // leaflet layer dependencies
  public layerMarkers = new L.layerGroup();
  public markersList = new L.FeatureGroup();

  // assigning the data to each of these to show in dropdowns and maps
  // for dropdowns
  public data: any;
  public markers: any = [];
  // for maps
  public districtMarkers: any = [];
  public blockMarkers: any = [];
  public clusterMarkers: any = [];
  public schoolMarkers: any = [];

  // to show and hide the dropdowns based on the selection of buttons
  public stateLevel: any = 0; // 0 for buttons and 1 for dropdowns

  // to download the excel report
  public fileName: any;
  public reportData: any = [];

  // variables
  public districtId: any = '';
  public blockId: any = '';
  public clusterId: any = '';

  public myData;

  public myDistData: any;
  public myBlockData: any = [];
  public myClusterData: any = [];
  public mySchoolData: any = [];
  public level;

  allGrades = [];
  allSubjects = [];
  grade;
  subject;

  constructor(
    public http: HttpClient,
    public service: PatReportService,
    public commonService: AppServiceComponent,
    public router: Router,
    private changeDetection: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.commonService.initMap('patMap');
    this.districtWise();
    document.getElementById('backBtn').style.display = "none";
    document.getElementById('homeBtn').style.display = "Block";
  }

  onGradeSelect(data) {
    this.grade = data;
    this.subjectHidden = false;
    this.subject = '';
    this.allSubjects = Object.keys(this.data[0]['grades'][`${this.grade}`])
    if (this.level == 'district') {
      this.districtWise();
    }
    if (this.level == 'block_wise') {
      this.blockWise();
    }
    if (this.level == 'cluster_wise') {
      this.clusterWise();
    }
    if (this.level == 'school_wise') {
      this.schoolWise();
    }

    if (this.level == 'block') {
      this.onDistrictSelect(this.districtId);
    }
    if (this.level == 'cluster') {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == 'school') {
      this.onClusterSelect(this.clusterId);
    }
  }
  onSubjectSelect(data) {
    this.subject = data;
    if (this.level == 'district') {
      this.districtWise();
    }
    if (this.level == 'block_wise') {
      this.blockWise();
    }
    if (this.level == 'cluster_wise') {
      this.clusterWise();
    }
    if (this.level == 'school_wise') {
      this.schoolWise();
    }

    if (this.level == 'block') {
      this.onDistrictSelect(this.districtId);
    }
    if (this.level == 'cluster') {
      this.onBlockSelect(this.blockId);
    }
    if (this.level == 'school') {
      this.onClusterSelect(this.clusterId);
    }
  }
  // to load all the districts for state data on the map
  districtWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.districtId = undefined;
      if (this.level != 'district') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.reportData = [];
      this.commonService.errMsg();
      this.level = 'district';
      this.fileName = "Dist_wise_report";
      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;
      // api call to get all the districts data
      if (this.myDistData != undefined) {
        this.data = this.myDistData['data'];
        // to show only in dropdowns
        this.districtMarkers = this.myDistData['data'];
        // options to set for markers in the map
        let options = {
          radius: 5,
          fillOpacity: 1,
          strokeWeight: 0.01,
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: 'district'
        }

        this.genericFun(this.myDistData, options, this.fileName);
        // sort the districtname alphabetically
        this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

      } else {
        if (this.myData) {
          this.myData.unsubscribe();
        }
        this.myData = this.service.PATDistWiseData().subscribe(res => {
          this.myDistData = res;
          this.data = res['data'];

          // to show only in dropdowns
          this.districtMarkers = this.data;

          // options to set for markers in the map
          let options = {
            radius: 5,
            fillOpacity: 1,
            strokeWeight: 0.01,
            mapZoom: 7,
            centerLat: 22.3660414123535,
            centerLng: 71.48396301269531,
            level: 'district'
          }
          this.genericFun(this.myDistData, options, this.fileName);

          // sort the districtname alphabetically
          this.districtMarkers.sort((a, b) => (a.details.district_name > b.details.district_name) ? 1 : ((b.details.district_name > a.details.district_name) ? -1 : 0));

        }, err => {
          this.data = [];
          this.commonService.loaderAndErr(this.data);
        });
      }

      // adding the markers to the map layers
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'none';

    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for state data on the map
  blockWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'block_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.level = 'block_wise';
      this.fileName = "Block_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.PATBlockWiseData().subscribe(res => {
        this.myBlockData = res['data'];
        this.data = res['data'];
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "block"
        }

        if (this.data.length > 0) {
          let result = this.data
          this.blockMarkers = [];
          this.blockMarkers = result;

          this.schoolCount = 0;
          this.blockMarkers.sort((a, b) => (a.pat_scores['School Performance'] > b.pat_scores['School Performance']) ? 1 : ((b.pat_scores['School Performance'] > a.pat_scores['School Performance']) ? -1 : 0));
          // generate color gradient
          let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', this.blockMarkers.length, 'rgb');
          this.colors = colors;
          for (let i = 0; i < this.blockMarkers.length; i++) {
            var markerIcon = this.commonService.initMarkers(this.blockMarkers[i].details.latitude, this.blockMarkers[i].details.longitude, this.colors[i], 3.5, 0.01, undefined, options.level);
            this.generateToolTip(this.blockMarkers[i], options.level, markerIcon, "latitude", "longitude");
            this.getDownloadableData(this.blockMarkers[i], options.level);
            if (this.blockMarkers[i]['grades']) {
              this.allGrades = Object.keys(this.blockMarkers[i]['grades']);
            }
          }

          globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);


          //schoolCount
          this.schoolCount = res['footer'].total_schools;
          this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
          this.studentCount = res['footer'].students_count;
          this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

          this.commonService.loaderAndErr(this.data);
          this.changeDetection.markForCheck();
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the clusters for state data on the map
  clusterWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'cluster_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = "cluster_wise";
      this.fileName = "Cluster_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all clusters data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.PATClusterWiseData().subscribe(res => {
        this.data = res['data']
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "cluster"
        }

        if (this.data.length > 0) {
          let result = this.data
          this.clusterMarkers = [];
          this.clusterMarkers = result;
          this.schoolCount = 0;
          if (this.clusterMarkers.length !== 0) {
            this.clusterMarkers.sort((a, b) => (a.pat_scores['School Performance'] > b.pat_scores['School Performance']) ? 1 : ((b.pat_scores['School Performance'] > a.pat_scores['School Performance']) ? -1 : 0));
            // generate color gradient
            let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', this.clusterMarkers.length, 'rgb');
            this.colors = colors;
            for (let i = 0; i < this.clusterMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.clusterMarkers[i].details.latitude, this.clusterMarkers[i].details.longitude, this.colors[i], 0, 0.01, undefined, options.level);
              this.generateToolTip(this.clusterMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.clusterMarkers[i], options.level);
              if (this.clusterMarkers[i]['grades']) {
                this.allGrades = Object.keys(this.clusterMarkers[i]['grades']);
              }
            }

            //schoolCount
            this.schoolCount = res['footer'].total_schools;
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            this.studentCount = res['footer'].students_count;
            this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the schools for state data on the map
  schoolWise() {
    try {
      // to clear the existing data on the map layer
      globalMap.removeLayer(this.markersList);
      this.layerMarkers.clearLayers();
      this.commonService.errMsg();
      if (this.level != 'school_wise') {
        this.subjectHidden = true;
        this.grade = undefined;
        this.subject = undefined;
      }
      this.allGrades = [];
      this.reportData = [];
      this.districtId = undefined;
      this.blockId = undefined;
      this.clusterId = undefined;
      this.level = 'school_wise';
      this.fileName = "School_wise_report";

      // these are for showing the hierarchy names based on selection
      this.skul = true;
      this.dist = false;
      this.blok = false;
      this.clust = false;

      // to show and hide the dropdowns
      this.blockHidden = true;
      this.clusterHidden = true;

      // api call to get the all schools data
      if (this.myData) {
        this.myData.unsubscribe();
      }
      this.myData = this.service.PATSchoolWiseData().subscribe(res => {
        this.data = res['data']
        let options = {
          mapZoom: 7,
          centerLat: 22.3660414123535,
          centerLng: 71.48396301269531,
          level: "school"
        }

        this.schoolMarkers = [];
        if (this.data.length > 0) {
          let result = this.data
          this.schoolCount = 0;
          this.schoolMarkers = result;
          if (this.schoolMarkers.length !== 0) {
            this.schoolMarkers.sort((a, b) => (a.pat_scores['School Performance'] > b.pat_scores['School Performance']) ? 1 : ((b.pat_scores['School Performance'] > a.pat_scores['School Performance']) ? -1 : 0));
            // generate color gradient
            let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', this.schoolMarkers.length, 'rgb');
            this.colors = colors;
            for (let i = 0; i < this.schoolMarkers.length; i++) {
              var markerIcon = this.commonService.initMarkers(this.schoolMarkers[i].details.latitude, this.schoolMarkers[i].details.longitude, this.colors[i], 0, 0, undefined, options.level);
              this.generateToolTip(this.schoolMarkers[i], options.level, markerIcon, "latitude", "longitude");
              this.getDownloadableData(this.schoolMarkers[i], options.level);
              if (this.schoolMarkers[i]['grades']) {
                this.allGrades = Object.keys(this.schoolMarkers[i]['grades']);
              }
            }

            globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), 7.3);

            //schoolCount
            this.schoolCount = res['footer'].total_schools;
            this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
            this.studentCount = res['footer'].students_count;
            this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

            this.commonService.loaderAndErr(this.data);
            this.changeDetection.markForCheck();
          }
        }
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });

      globalMap.addLayer(this.layerMarkers);
      document.getElementById('home').style.display = 'block';
    } catch (e) {
      console.log(e);
    }
  }

  // to load all the blocks for selected district for state data on the map
  onDistrictSelect(districtId) {
    // to clear the existing data on the map layer  
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'block') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.blockId = undefined;
    this.reportData = [];
    this.level = 'block';
    var fileName = "Block_per_dist_report";

    // api call to get the blockwise data for selected district
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATBlocksPerDistData(districtId).subscribe(res => {
      this.data = res['data']

      this.blockMarkers = this.data;
      // set hierarchy values
      this.districtHierarchy = {
        distId: this.data[0].details.district_id,
        districtName: this.data[0].details.district_name
      }

      // to show and hide the dropdowns
      this.blockHidden = false;
      this.clusterHidden = true;

      this.districtId = districtId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = true;
      this.blok = false;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: 3.5,
        fillOpacity: 1,
        strokeWeight: 0.01,
        mapZoom: 8.3,
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'block'
      }

      this.genericFun(res, options, fileName);
      // sort the blockname alphabetically
      this.blockMarkers.sort((a, b) => (a.details.block_name > b.details.block_name) ? 1 : ((b.details.block_name > a.details.block_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the clusters for selected block for state data on the map
  onBlockSelect(blockId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'cluster') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    this.clusterId = undefined;
    this.reportData = [];
    this.level = 'cluster';
    var fileName = "Cluster_per_block_report";

    // api call to get the clusterwise data for selected district, block
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATClustersPerBlockData(this.districtHierarchy.distId, blockId).subscribe(res => {
      this.data = res['data']

      this.clusterMarkers = this.data;
      var myBlocks = [];
      this.blockMarkers.forEach(element => {
        if (element.details.district_id === this.districtHierarchy.distId) {
          myBlocks.push(element);
        }
      });
      this.blockMarkers = myBlocks;

      // set hierarchy values
      this.blockHierarchy = {
        distId: this.data[0].details.district_id,
        districtName: this.data[0].details.district_name,
        blockId: this.data[0].details.block_id,
        blockName: this.data[0].details.block_name
      }

      // to show and hide the dropdowns
      this.blockHidden = false;
      this.clusterHidden = false;

      this.districtId = this.data[0].details.district_id;
      this.blockId = blockId;

      // these are for showing the hierarchy names based on selection
      this.skul = false;
      this.dist = false;
      this.blok = true;
      this.clust = false;

      // options to set for markers in the map
      let options = {
        radius: 3,
        fillOpacity: 1,
        strokeWeight: 0.01,
        mapZoom: 10,
        centerLat: this.data[0].details.latitude,
        centerLng: this.data[0].details.longitude,
        level: 'cluster'
      }

      this.genericFun(res, options, fileName);
      // sort the clusterName alphabetically
      this.clusterMarkers.sort((a, b) => (a.details.cluster_name > b.details.cluster_name) ? 1 : ((b.details.cluster_name > a.details.cluster_name) ? -1 : 0));
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // to load all the schools for selected cluster for state data on the map
  onClusterSelect(clusterId) {
    // to clear the existing data on the map layer
    globalMap.removeLayer(this.markersList);
    this.layerMarkers.clearLayers();
    this.commonService.errMsg();
    if (this.level != 'school') {
      this.subjectHidden = true;
      this.grade = undefined;
      this.subject = undefined;
    }
    // api call to get the schoolwise data for selected district, block, cluster
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.PATBlockWiseData().subscribe((result: any) => {
      this.myData = this.service.PATSchoolssPerClusterData(this.blockHierarchy.distId, this.blockHierarchy.blockId, clusterId).subscribe(res => {
        this.data = res['data'];

        this.schoolMarkers = this.data;
        var markers = result['data'];
        var myBlocks = [];
        markers.forEach(element => {
          if (element.details.district_id === this.blockHierarchy.distId) {
            myBlocks.push(element);
          }
        });
        this.blockMarkers = myBlocks;
        this.blockMarkers.sort((a, b) => (a.details.block_name > b.details.block_name) ? 1 : ((b.details.block_name > a.details.block_name) ? -1 : 0));

        var myCluster = [];
        this.clusterMarkers.forEach(element => {
          if (element.details.block_id === this.blockHierarchy.blockId) {
            myCluster.push(element);
          }
        });
        this.clusterMarkers = myCluster;

        // set hierarchy values
        this.clusterHierarchy = {
          distId: this.data[0].details.district_id,
          districtName: this.data[0].details.district_name,
          blockId: this.data[0].details.block_id,
          blockName: this.data[0].details.block_name,
          clusterId: this.data[0].details.cluster_id,
          clusterName: this.data[0].details.cluster_name,
        }

        this.blockHidden = false;
        this.clusterHidden = false;

        this.districtHierarchy = {
          distId: this.data[0].details.district_id
        }

        this.districtId = this.data[0].details.district_id;
        this.blockId = this.data[0].details.block_id;
        this.clusterId = clusterId;

        // these are for showing the hierarchy names based on selection
        this.skul = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;

        // options to set for markers in the map
        let options = {
          radius: 3.5,
          fillOpacity: 1,
          strokeWeight: 0.01,
          mapZoom: 12,
          centerLat: this.data[0].details.latitude,
          centerLng: this.data[0].details.longitude,
          level: "school"
        }
        this.level = options.level;
        var fileName = "School_per_cluster_report";
        this.genericFun(res, options, fileName);
      }, err => {
        this.data = [];
        this.commonService.loaderAndErr(this.data);
      });
    }, err => {
      this.data = [];
      this.commonService.loaderAndErr(this.data);
    });
    globalMap.addLayer(this.layerMarkers);
    document.getElementById('home').style.display = 'block';
  }

  // common function for all the data to show in the map
  genericFun(data, options, fileName) {
    this.reportData = [];
    this.allGrades = [];
    this.schoolCount = 0;
    var myData = data['data'];
    if (myData.length > 0) {
      this.markers = myData;
      this.markers.sort((a, b) => (a.pat_scores['School Performance'] > b.pat_scores['School Performance']) ? 1 : ((b.pat_scores['School Performance'] > a.pat_scores['School Performance']) ? -1 : 0));
      // generate color gradient
      let colors = this.commonService.color().generateGradient('#FF0000', '#7FFF00', this.markers.length, 'rgb');
      this.colors = colors;
      // attach values to markers
      for (var i = 0; i < this.markers.length; i++) {
        var markerIcon = this.commonService.initMarkers(this.markers[i].details.latitude, this.markers[i].details.longitude, this.colors[i], options.radius, options.strokeWeight, 1, options.level);
        globalMap.setZoom(options.mapZoom);
        if (this.markers[i]['grades']) {
          this.allGrades = Object.keys(this.markers[i]['grades']);
        }

        // data to show on the tooltip for the desired levels
        this.generateToolTip(this.markers[i], options.level, markerIcon, "latitude", "longitude");

        // to download the report
        this.fileName = fileName;
        this.getDownloadableData(this.markers[i], options.level);
      }
      this.commonService.loaderAndErr(this.data);
      this.changeDetection.markForCheck();
    }
    // schoolCount
    this.schoolCount = data['footer'].total_schools;
    this.schoolCount = (this.schoolCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    this.studentCount = data['footer'].students_count;
    this.studentCount = (this.studentCount).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

    globalMap.setView(new L.LatLng(options.centerLat, options.centerLng), options.mapZoom);
  }

  generateToolTip(markers, level, markerIcon, lat, lng) {
    this.popups(markerIcon, markers, level);
    let colorText = `style='color:blue !important;'`;
    var details = {};
    var orgObject = {};
    Object.keys(markers.details).forEach(key => {
      if (key !== lat) {
        details[key] = markers.details[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== lng) {
        orgObject[key] = details[key];
      }
    });
    var ordered = {};
    Object.keys(markers.pat_scores).sort().forEach(function (key) {
      ordered[key] = markers.pat_scores[key];
    });
    if (level != 'school') {
      orgObject['total_schools'] = orgObject['total_schools'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    }
    orgObject['students_count'] = orgObject['students_count'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");

    var yourData1 = this.commonService.getInfoFrom(orgObject, "", level, this.reportData, "patReport", '', colorText).join(" <br>");
    var yourData;
    if (this.grade && !this.subject) {
      yourData = this.commonService.getInfoFrom(markers.grades[`${this.grade}`], "", level, this.reportData, "patReport", '', colorText).join(" <br>");
    } else if (this.grade && this.subject) {
      yourData = this.commonService.getInfoFrom(markers.grades[`${this.grade}`], "", level, this.reportData, "patReport", this.subject, colorText).join(" <br>");
    } else {
      yourData = this.commonService.getInfoFrom(ordered, "", level, this.reportData, "patReport", '', colorText).join(" <br>");
    }

    const popup = R.responsivePopup({ hasTip: false, autoPan: false, offset: [15, 20] }).setContent(
      "<b><u>Details</u></b>" +
      "<br>" + yourData1 +
      "<br><br><b><u>Periodic Exam Score (%)</u></b>" +
      "<br>" + yourData);
    markerIcon.addTo(globalMap).bindPopup(popup);
  }

  popups(markerIcon, markers, level) {
    for (var i = 0; i < this.markers.length; i++) {
      markerIcon.on('mouseover', function (e) {
        this.openPopup();
      });
      markerIcon.on('mouseout', function (e) {
        this.closePopup();
      });

      this.layerMarkers.addLayer(markerIcon);
      if (level != 'school') {
        markerIcon.on('click', this.onClick_Marker, this);
      }
      markerIcon.myJsonData = markers;
    }
  }

  //Showing tooltips on markers on mouse hover...
  onMouseOver(m, infowindow) {
    m.lastOpen = infowindow;
    m.lastOpen.open();
  }

  //Hide tooltips on markers on mouse hover...
  hideInfo(m) {
    if (m.lastOpen != null) {
      m.lastOpen.close();
    }
  }

  // drilldown/ click functionality on markers
  onClick_Marker(event) {
    var data = event.target.myJsonData.details;
    if (data.district_id && !data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.onDistrictSelect(data.district_id)
    }
    if (data.district_id && data.block_id && !data.cluster_id) {
      this.stateLevel = 1;
      this.districtHierarchy = {
        distId: data.district_id
      }
      this.onBlockSelect(data.block_id)
    }
    if (data.district_id && data.block_id && data.cluster_id) {
      this.stateLevel = 1;
      this.blockHierarchy = {
        distId: data.district_id,
        blockId: data.block_id
      }
      this.onClusterSelect(data.cluster_id)
    }
  }

  // to download the csv report
  downloadReport() {
    this.commonService.download(this.fileName, this.reportData);
  }

  // getting data to download........
  getDownloadableData(markers, level) {
    var details = {};
    var orgObject = {};
    Object.keys(markers.details).forEach(key => {
      if (key !== "latitude") {
        details[key] = markers.details[key];
      }
    });
    Object.keys(details).forEach(key => {
      if (key !== "longitude") {
        orgObject[key] = details[key];
      }
    });
    var ordered = {};
    if (this.grade && !this.subject) {
      ordered = markers.grades[`${this.grade}`];
    } else if (this.grade && this.subject) {
      ordered = { [`${this.subject}` + '_score']: markers.grades[`${this.grade}`][`${this.subject}`] }
    } else {
      Object.keys(markers.pat_scores).sort().forEach(function (key) {
        ordered[key] = markers.pat_scores[key];
      });
    }

    var myobj = Object.assign(orgObject, ordered);
    this.reportData.push(myobj);
  }
}