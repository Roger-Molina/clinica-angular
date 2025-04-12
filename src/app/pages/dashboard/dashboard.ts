import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { CalendarioComponent } from '../../agenda/componentes/calendario/calendario.component';
import { UniversalTableComponent } from "../../globales/componentes/tabla/tabla.component";

@Component({
    selector: 'app-dashboard',
    imports: [CalendarioComponent, UniversalTableComponent],
    template: `
 
     
            <app-calendario />

            <br>
            <app-universal-table>

    `
})
export class Dashboard {}
