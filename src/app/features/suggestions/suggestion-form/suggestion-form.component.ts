import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/Services/suggestion.service';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;
  isUpdate: boolean = false;
  id!: number;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private actR: ActivatedRoute,
    private service: SuggestionService
  ) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^[A-Z][a-zA-Z]*$')
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],
      date: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }]
    });

    this.id = this.actR.snapshot.params['id'];
    if (this.id) {
      this.isUpdate = true;
      this.service.getSuggestionById(this.id).subscribe(data => {
        this.suggestionForm.patchValue({
          title: data.title,
          description: data.description,
          category: data.category,
          date: data.date,
          status: data.status
        });
      });
    } else {
      this.suggestionForm.patchValue({
        date: new Date().toLocaleDateString('fr-FR'),
        status: 'en attente'
      });
    }
  }

  onSubmit(): void {
    if (this.isUpdate) {
      const updatedSuggestion: Suggestion = {
        ...this.suggestionForm.getRawValue(),
        id: Number(this.id)
      };
      this.service.updateSuggestion(Number(this.id), updatedSuggestion).subscribe({
  next: () => {
    this.router.navigate(['/suggestions']);
  },
  error: (err) => {
    console.error('Erreur update:', err);
  }
});
    } else {
      if (this.suggestionForm.valid) {
        const newSuggestion: Suggestion = {
          ...this.suggestionForm.getRawValue(),
          date: new Date(),
          status: 'en_attente',
          nbLikes: 0
        };
        this.service.addSuggestion(newSuggestion).subscribe({
          next: () => {
            this.router.navigate(['/suggestions']);
          },
          error: (err) => {
            console.error('Erreur ajout:', err);
          }
        });
      }
    }
  }
}