import { Observable } from "rxjs";

export interface IRepositoryService<T> {
    getAll(): Observable<Array<T>>;
    find(id: number): Observable<T>;
}
