alert("Loading module");

import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent }  from "./app.component";
import { ThingRepositoryService } from "./services/thing.repository.service";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule, HttpModule],
    providers: [ThingRepositoryService],
})
export class AppModule { }

