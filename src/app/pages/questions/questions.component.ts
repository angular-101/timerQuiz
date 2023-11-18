import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  constructor(public quizService: QuizService, private router: Router) {}
  public correctAns: any = '';
  public timeLeft: any = 15;
  private countdownInterval: any;

  checkCorrectAnswer(option: string): boolean {
    this.quizService.userSelectedAns = option;
    return option === this.quizService.currentQuestion.correct_answer;
  }

  newQuestion(): void {
    this.quizService.currentQuestion = {};
    this.correctAns = '';
    this.quizService.userSelectedAns = '';
  }

  formatQuestion(currentQuestion: any): void {
    currentQuestion.incorrect_answers.push(currentQuestion.correct_answer);
    currentQuestion.incorrect_answers.sort(() => Math.random() - 0.5);
    this.quizService.currentQuestion = currentQuestion;
    console.log('currentQuestion', this.quizService.currentQuestion);
  }

  ngOnInit(): void {
    if (!this.quizService.userName) {
      this.router.navigate(['/home']);
      return;
    }

    this.quizService
      .fetchQuestions()
      .then(({ results }: any) => {
        this.quizService.questions = results;
        const { questions, currentQuestionIndex } = this.quizService;
        const currentQuestion = questions[currentQuestionIndex];
        this.formatQuestion(currentQuestion);
        console.log(this.quizService.currentQuestion);

        this.countdownInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            this.handleClick('aa');
          }
        }, 1000);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  handleClick(option: string) {
    this.correctAns = this.checkCorrectAnswer(option);
    if (this.correctAns) {
      this.quizService.currentScore += 1;
      this.quizService.currentQuestionIndex += 1;

      this.newQuestion();
      this.formatQuestion(
        this.quizService.questions[this.quizService.currentQuestionIndex]
      );
    } else {
      this.quizService.updateScore(this.quizService.currentScore);

      setTimeout(() => {
        this.quizService.userName = '';
        this.quizService.currentScore = 0;
        this.quizService.currentQuestionIndex = 0;
        this.quizService.userSelectedAns = '';
        this.quizService.currentQuestion = 0;
        clearInterval(this.countdownInterval);
        this.timeLeft = 15;

        this.router.navigate(['/home']);
      }, 4000);
    }
  }
}
