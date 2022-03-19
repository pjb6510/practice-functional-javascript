import { Task } from 'fp-ts/Task';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import { createInterface } from 'readline';

// 비동기로 작동하는 사이드이펙트인데 실패할 일이 없으면 Task(함수)

export const read: Task<string> = () =>
  new Promise<string>((resolve) => {
    const readLine = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readLine.question('', (answer) => {
      readLine.close();
      resolve(answer);
    });
  });

// 비동기로 작동하는 사이드이펙트인데 Exception이 있을 수 있으면 TaskEither(함수)

export const httpFetch = (url: string): TaskEither<Error, string> =>
  tryCatch(
    () => fetch(url).then((res) => res.text()),
    (reason) => new Error(String(reason))
  );
