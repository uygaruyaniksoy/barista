import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DtTagModule } from '@dynatrace/barista-components/tag';
import { DtE2ETagList } from './tag-list';

const routes: Route[] = [{ path: '', component: DtE2ETagList }];

@NgModule({
  declarations: [DtE2ETagList],
  imports: [CommonModule, RouterModule.forChild(routes), DtTagModule],
  exports: [],
  providers: [],
})
export class DtE2ETagListModule {}
