import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import mkdirp from 'mkdirp';

function writeFile(filePath, content) {
  const fileDir = path.dirname(filePath);
  return new Promise((resolve, reject) =>
    mkdirp(fileDir, error =>
      error ? reject(error) : fs.writeFile(filePath, content, resolve)));
}

gulp.task('azure-tasks:generate-server', () => {
  const serverPath = path.resolve(__dirname, '../server.js');
  const content = 'require("./dist/index");';
  return writeFile(serverPath, content);
});

gulp.task('azure-tasks:generate-job', () => {
  const nodePath = path.resolve(__dirname, '../node.cmd');
  const jobPath = path.resolve(__dirname, '../dist/job.js');
  const runPath = path.resolve(__dirname, '../App_Data/jobs/continuous/depcheck/run.cmd');
  const content = `"${nodePath}" "${jobPath}"`;
  return writeFile(runPath, content);
});

gulp.task('azure-tasks:configuration', ['configuration'], () =>
  writeFile(
    path.resolve(__dirname, '../dist/services/configuration.json'),
    JSON.stringify({ provider: 'azure' })));

gulp.task('azure-tasks', [
  'azure-tasks:generate-server',
  'azure-tasks:generate-job',
  'azure-tasks:configuration',
]);
