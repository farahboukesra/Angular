import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  private apiUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) {}

  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.apiUrl);
  }

  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http
      .get<{ success: boolean; suggestion: Suggestion }>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.suggestion),
      );
  }

  addSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.apiUrl, suggestion);
  }

  updateSuggestion(id: number, suggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.apiUrl}/${id}`, suggestion);
  }

  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

updateLikes(id: number, nbLikes: number): Observable<Suggestion> {
  return this.http.put<Suggestion>(`${this.apiUrl}/${id}`, { nbLikes });
}
}