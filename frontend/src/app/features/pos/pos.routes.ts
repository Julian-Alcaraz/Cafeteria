import { Routes } from '@angular/router';
import { PosLayoutComponent } from './components/pos-layout/pos-layout.component';
import { SalesHistoryComponent } from './components/sales-history/sales-history.component';

export const POS_ROUTES: Routes = [
  { path: '', component: PosLayoutComponent },
  { path: 'sales', component: SalesHistoryComponent }
];
