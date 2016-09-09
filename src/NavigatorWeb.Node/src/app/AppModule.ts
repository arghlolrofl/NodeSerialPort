import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent }  from "./AppComponent";
import { ThingRepositoryService } from "./repositories/ThingService";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule, HttpModule],
    providers: [ThingRepositoryService],
})
export class AppModule { }

