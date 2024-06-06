import { Component, OnInit, Input, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef  } from '@angular/core';
import { DataField } from 'app/shared/list-data/list-data.model';
import { DataInfo } from 'app/shared/data-info.model';

@Component({
  selector: 'cb-data-field',
  templateUrl: './data-field.component.html',
  styleUrls: ['./data-field.component.css']
})
export class DataFieldComponent implements OnInit {
  @Input() data: any;
  @Input() dataInfo: DataInfo;
  @Input() dataField: DataField;
  @ViewChild('containerRef', {static: true, read: ViewContainerRef}) containerRef: ViewContainerRef;

  simpleData: string;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.dataField.component != null
      ? this.renderComponent(this.dataField.component)
      : this.simpleData = this.dataField.showData(this.data)
  }

  renderComponent(renderComponent: Type<any>) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(renderComponent)
    let createComponent = this.containerRef.createComponent(factory)
    let instance = createComponent.instance
    this.dataField.afterCreateComponent(this.data, this.dataInfo, instance)
  }
}
