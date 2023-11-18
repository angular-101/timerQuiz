import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService
      .fetchLeaderboardDetails()
      .then((data: any) => {
        this.quizService.leaderBoardList = data.sort(
          (a: any, b: any) => b.score - a.score
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
