import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-node-logs',
  templateUrl: './node-logs.component.html',
  styleUrls: ['./node-logs.component.css']
})
export class NodeLogsComponent implements OnInit {
  public logs;
  fileName = '';
  constructor(private router: Router, private service: AppService) { }

  ngOnInit() {
    this.service.nodeLogs(false).subscribe(res => {
      this.logs = res;
    })
  }

  downloadNodeLog() {
    this.service.nodeLogs(true).subscribe(res => {
      this.fileName = "nodeLogs"
      this.dyanmicDownloadByHtmlTag({
        fileName: this.fileName,
        text: res.toString()
      });
    })
  }

  //for download txt file

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}