import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  public userName: string = '';
  public userSelectedAns: string = '';
  public leaderBoardList: Array<any> = [];
  public questions: Array<any> = [];
  public currentQuestion: any = {};
  public currentScore: number = 0;
  public currentQuestionIndex: number = 0;

  public fetchLeaderboardDetails(): any {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/leaderboard').subscribe(
        (data: any) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  public fetchQuestions(): any {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          'https://opentdb.com/api.php?amount=20&difficulty=hard&type=multiple'
        )
        .subscribe(
          (data: any) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  public updateScore(score: any): any {
    console.log("score1", score)
    this.http
      .get('http://localhost:3000/leaderboard?username=' + this.userName)
      .subscribe((res: any) => {
        console.log("res1", res, this.userName)
        if (res?.length == 0) {
          console.log("Dhoom")
          this.http
            .post('http://localhost:3000/leaderboard', {
              username: this.userName,
              score: score,
            })
            .subscribe(
              (resp) => {
                console.log('post');
                console.log(resp);
              },
              (error) => {
                console.log(error);
              }
            );
        } else {
          console.log("res[0]", res[0])
          if (res[0].score < score) {
            res[0].score = score;
            this.http
              .put('http://localhost:3000/leaderboard/' + res[0].id, res[0])
              .subscribe(
                (uRes) => {
                  console.log(uRes);
                },
                (uErr) => {
                  console.log(uErr);
                }
              );
          }
        }
      });
  }
}
