import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData, DatePipe, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_LABEL_GLOBAL_OPTIONS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule, MatBadge } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageGalleryModule } from 'ngx-image-gallery';

import { ROUTES } from './app.routes';

import { HeaderModule } from './header/header.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { MaskDirective } from './shared/mask.directive';
import { UcWordsDirective } from './shared/uc-words.directive';

import { HomeComponent } from './home/home.component';
import { NotificationBarComponent } from './notification-bar/notification-bar.component';
import { MeasureComponent } from './measures/measure.component';
import { MeasureService } from './measures/measure.service';
import { FinalityComponent } from './finality/finality.component';
import { FinalityService } from './finality/finality.service';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderService } from './purchase-order/purchase-order.service';
import { UserComponent } from './user/user.component';
import { DepartmentComponent } from './department/department.component';
import { LayoutComponent } from './layout/layout.component';
import { StateService } from './address/state.service';
import { CityService } from './address/city.service';
import { ClientTypeService } from './clients/client-types/client-type.service';
import { ClientStatusService } from './clients/client-status/client-status.service';
import { EmployeeService } from './employees/employee.service';

import { ClientFormComponent } from './clients/client-form/client-form.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientShowComponent } from './clients/client-show/client-show.component';
import { ClientImportComponent } from './clients/client-import/client-import.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientService } from './clients/client.service';

import { ProviderFormComponent } from './providers/provider-form/provider-form.component';
import { ProviderListComponent } from './providers/provider-list/provider-list.component';
import { ProviderShowComponent } from './providers/provider-show/provider-show.component';
import { ProvidersComponent } from './providers/providers.component';
import { ProviderService } from './providers/provider.service';

import { BankAccountTypeService } from './bank-account-types/bank-account-type.service';
import { BankService } from './banks/bank.service';
import { PersonTypeService } from './person-types/person-type.service';

import { CostCategoryFormComponent } from './cost-categories/cost-category-form/cost-category-form.component';
import { CostCategoryListComponent } from './cost-categories/cost-category-list/cost-category-list.component';
import { CostCategoryShowComponent } from './cost-categories/cost-category-show/cost-category-show.component';
import { CostCategoriesComponent } from './cost-categories/cost-categories.component';
import { CostCategoryService } from './cost-categories/cost-category.service';

import { ItemCategoryFormComponent } from './item-categories/item-category-form/item-category-form.component';
import { ItemCategoryListComponent } from './item-categories/item-category-list/item-category-list.component';
import { ItemCategoryShowComponent } from './item-categories/item-category-show/item-category-show.component';
import { ItemCategoriesComponent } from './item-categories/item-categories.component';
import { ItemCategoryService } from './item-categories/item-category.service';

import { StandFormComponent } from './stand/stand-form/stand-form.component';
import { StandItemFormComponent } from './stand/stand-items/stand-item-form/stand-item-form.component';

import { JobActivityService } from './job-activities/job-activity.service';
import { JobTypeService } from './job-types/job-type.service';
import { JobCompetitionService } from './job-competitions/job-competition.service';

import { ItemFormComponent } from './items/item-form/item-form.component';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemShowComponent } from './items/item-show/item-show.component';
import { ItemsComponent } from './items/items.component';
import { ItemService } from './items/item.service';

import { StarsComponent } from './shared/stars/stars.component';
import { ProductionTimeComponent } from './shared/production-time/production-time.component';
import { UploadFileService } from './shared/upload-file.service';
import { ReadMoreComponent } from './shared/text/read-more.component';

import { BriefingPresentationService } from 'app/briefing-presentations/briefing-presentation.service';
import { StandConfigurationService } from 'app/stand-configurations/stand-configuration.service';
import { StandGenreService } from 'app/stand-genres/stand-genre.service';
import { StandItemService } from 'app/stand/stand-items/stand-item.service';
import { PaginatorIntl } from 'app/shared/paginator-intl.model';
import { TimecardComponent } from './timecard/timecard.component';
import { TimecardService } from './timecard/timecard.service';
import { TimecardFormComponent } from './timecard/timecard-form/timecard-form.component';
import { TimecardListComponent } from './timecard/timecard-list/timecard-list.component';
import { TimecardApprovalsComponent } from './timecard/timecard-approvals/timecard-approvals.component';
import { TimecardPlaceService } from './timecard/timecard-place/timecard-place.service';
import { JobLevelService } from './job-level/job-level.service';
import { JobMainExpectationService } from './job-main-expectation/job-main-expectation.service';
import { ScheduleComponent, ReloadComponent, ScheduleBottomSheet } from './schedule/schedule.component';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { CustomCurrencyMaskConfig } from 'app/shared/custom-currency-mask-config';
import { JobStatusService } from 'app/job-status/job-status.service';

import { JobTabsComponent } from './jobs/job-tabs/job-tabs.component';
import { JobsComponent } from './jobs/jobs.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobService } from './jobs/job.service';
import { ReportService} from './reports/service-report/report-list.service';
import { JobFormComponent } from './jobs/job-form/job-form.component';

import { BriefingFormComponent } from './briefings/briefing-form/briefing-form.component';
import { BriefingService } from './briefings/briefing.service';

import { BudgetFormComponent } from './budgets/budget-form/budget-form.component';
import { BudgetService } from './budgets/budget.service';
import { ScheduleFormComponent } from './schedule/schedule-form/schedule-form.component';
import { TaskService } from './schedule/task.service';

import localePt from '@angular/common/locales/pt';
import { ClientComissionService } from './clients/client-comission/client-comission.service';
import { UserNotification } from './notification-bar/user-notification/user-notification.model';
import { UserNotificationService } from './notification-bar/user-notification/user-notification.service';
import { NotificationItemComponent } from './notification-bar/notification-item/notification-item.component';
import { NotificationModule } from './notification-bar/notification.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectFileService } from './projects/project-file.service';
import { ScheduleLineComponent } from './schedule/schedule-line/schedule-line.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageViewerComponent } from './shared/image-viewer/image-viewer.component';
import { ScheduleBlockService } from './schedule/schedule-block/schedule-block.service';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProposalFormComponent } from './proposals/proposal-form/proposal-form.component';
import { ItemProposalFormComponent } from './proposals/proposal-form/item-proposal-form/item-proposal-form.component';
import { BlockDialogComponent } from './schedule/schedule-block/block-dialog/block-dialog.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeShowComponent } from './employees/employee-show/employee-show.component';
import { DepartmentService } from './department/department.service';
import { PositionService } from './position/position.service';
import { UserFormComponent } from './user/user-form/user-form.component';
import { EmployeeTabsComponent } from './employees/employee-tabs/employee-tabs.component';
import { UserService } from './user/user.service';
import { DisplayFormComponent } from './displays/display-form/display-form.component';
import { DisplayListComponent } from './displays/display-list/display-list.component';
import { DisplaysComponent } from './displays/displays.component';
import { DisplayShowComponent } from './displays/display-show/display-show.component';
import { DisplayService } from './displays/display.service';
import { FunctionalityFormComponent } from './functionalities/functionality-form/functionality-form.component';
import { FunctionalityListComponent } from './functionalities/functionality-list/functionality-list.component';
import { FunctionalitiesComponent } from './functionalities/functionalities.component';
import { FunctionalityShowComponent } from './functionalities/functionality-show/functionality-show.component';
import { FunctionalityService } from './functionalities/functionality.service';
import { UserPermissionComponent } from './user/user-permission/user-permission.component';
import { PlaceFormComponent } from './places/place-form/place-form.component';
import { PlaceListComponent } from './places/place-list/place-list.component';
import { PlacesComponent } from './places/places.component';
import { PlaceService } from './places/place.service';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventsComponent } from './events/events.component';
import { EventService } from './events/event.service';
import { PerformanceReportLiteComponent } from './reports/performance-report-lite/performance-report-lite.component';
import { SafePipe } from './shared/safe.pipe';
import { NumberAbbreviationPipe } from './shared/number-abbreviation.pipe';
import { SpecificationComponent } from './specification/specification.component';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { FileUploadService } from './shared/file-upload/file-upload.service';
import { SpecificationFileService } from './specification/specification-file.service';
import { LoggerService } from './shared/logger.service';
import { RouterExtService } from './shared/router-ext.service';
import { MessageLoadingComponent } from './shared/file-upload/message-loading/message-loading';
import { MessageLoadingService } from './shared/file-upload/message-loading/message-loading.service';
import { ListDataComponent } from './shared/list-data/list-data.component';
import { ListDataService } from './shared/list-data/list-data.service';
import { DataFieldComponent } from './shared/list-data/data-field/data-field.component';
import { UpdatedInfoComponent } from './shared/list-data/updated-info/updated-info.component';
import { ScheduleDateComponent } from './schedule/schedule-date/schedule-date.component';
import { AddHeaderInterceptor } from './shared/add-header-interceptor.config';
import { ServiceReportComponent } from './reports/service-report/report-list.component';
import { ServiceListComponent } from './reports/service-report/service-list/job-list.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material';
import { DecimalPipe } from './shared/decimal.pipe';
import { AlertsContainerComponent } from './alerts/components/alerts-container/alerts-container.component';
import { AlertService } from './alerts/alerts.service';
import { MemoriesContainerComponent } from './memories/components/memories-container/memories-container.component';
import { MemoriesService } from './memories/memories.service';
import { FormatMaskDirective } from './shared/directives/format-mask.directive';
import { JobEventsService } from './job-events/job-events.service';
import { SpecificationFormComponent } from './specification/specification-form/specification-form.component';
import { HomeService } from './home/home.service';
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartPreviewComponent } from './home/components/chart-preview.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    StarsComponent,
    MaskDirective,
    UcWordsDirective,
    NumberAbbreviationPipe,

    AppComponent,
    HomeComponent,
    NotificationBarComponent,
    MeasureComponent,
    FinalityComponent,
    PurchaseOrderComponent,
    UserComponent,
    DepartmentComponent,
    LayoutComponent,

    ClientsComponent,
    ClientFormComponent,
    ClientListComponent,
    ClientShowComponent,

    ProvidersComponent,
    ProviderFormComponent,
    ProviderListComponent,
    ProviderShowComponent,

    CostCategoriesComponent,
    CostCategoryFormComponent,
    CostCategoryListComponent,
    CostCategoryShowComponent,

    ItemCategoriesComponent,
    ItemCategoryFormComponent,
    ItemCategoryListComponent,
    ItemCategoryShowComponent,

    JobsComponent,
    JobListComponent,
    ServiceListComponent,

    StandFormComponent,
    StandItemFormComponent,

    ItemsComponent,
    ItemFormComponent,
    ItemListComponent,
    ItemShowComponent,
    ProductionTimeComponent,
    ReadMoreComponent,
    ClientImportComponent,

    TimecardComponent,
    TimecardFormComponent,
    TimecardListComponent,
    TimecardApprovalsComponent,
    ScheduleComponent,
    ScheduleBottomSheet,
    JobTabsComponent,
    JobsComponent,
    BriefingFormComponent,
    JobFormComponent,
    BudgetFormComponent,
    SpecificationFormComponent,
    ScheduleFormComponent,
    ReloadComponent,
    ProjectsComponent,
    ScheduleLineComponent,
    ImageViewerComponent,
    ProposalsComponent,
    SafePipe,
    ProposalFormComponent,
    ItemProposalFormComponent,
    BlockDialogComponent,

    EmployeeFormComponent,
    EmployeeListComponent,
    EmployeesComponent,
    EmployeeShowComponent,
    EmployeeTabsComponent,

    UserFormComponent,
    UserPermissionComponent,

    DisplayFormComponent,
    DisplayListComponent,
    DisplaysComponent,
    DisplayShowComponent,

    FunctionalityFormComponent,
    FunctionalityListComponent,
    FunctionalitiesComponent,
    FunctionalityShowComponent,

    PlaceFormComponent,
    PlaceListComponent,
    PlacesComponent,

    EventFormComponent,
    EventListComponent,
    EventsComponent,
    PerformanceReportLiteComponent,
    SpecificationComponent,
    FileUploadComponent,
    MessageLoadingComponent,
    ListDataComponent,
    DataFieldComponent,
    UpdatedInfoComponent,
    ScheduleDateComponent,
    ServiceReportComponent,
    DecimalPipe,

    AlertsContainerComponent,
    MemoriesContainerComponent,
    FormatMaskDirective,
    ChartPreviewComponent,

  ],
  imports: [
    CurrencyMaskModule,
    BrowserModule,
    MatNativeDateModule,
    HeaderModule,
    LoginModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxImageGalleryModule,
    RouterModule.forRoot(ROUTES),

    MatListModule,
    MatBottomSheetModule,
    DragDropModule,
    MatTableModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatRadioModule,
    MatBadgeModule,
    MatGridListModule,
    NotificationModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    CommonModule,
    NgApexchartsModule
  ],
  providers: [
    ClientService,
    ProviderService,
    BankAccountTypeService,
    BankService,
    PersonTypeService,
    CostCategoryService,
    ItemService,
    ItemCategoryService,
    PurchaseOrderService,
    MeasureService,
    FinalityService,
    CityService,
    StateService,
    ClientStatusService,
    ClientTypeService,
    EmployeeService,
    JobService,
    JobActivityService,
    JobTypeService,
    JobCompetitionService,
    BriefingPresentationService,
    JobLevelService,
    JobMainExpectationService,
    StandConfigurationService,
    StandGenreService,
    UploadFileService,
    StandItemService,
    TimecardService,
    TimecardPlaceService,
    JobStatusService,
    BriefingService,
    BudgetService,
    TaskService,
    ClientComissionService,
    UserNotificationService,
    ProjectFileService,
    ScheduleBlockService,
    DepartmentService,
    PositionService,
    UserService,
    DisplayService,
    FunctionalityService,
    PlaceService,
    EventService,
    FileUploadService,
    SpecificationFileService,
    LoggerService,
    RouterExtService,
    ListDataService,
    ReportService,
    JobEventsService,
    HomeService,

    MatDialog,
    MatSnackBar,
    MatSlideToggle,
    MessageLoadingService,
    AlertService,
    MemoriesService,
    DatePipe,
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' }},
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    {provide: MatPaginatorIntl, useClass: PaginatorIntl},
    {provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    {provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ScheduleBottomSheet,
    StarsComponent,
    StandItemFormComponent,
    ReloadComponent,
    ImageViewerComponent,
    BlockDialogComponent,
    MessageLoadingComponent,
    UpdatedInfoComponent,
    ChartPreviewComponent,
  ]
})
export class AppModule { }
