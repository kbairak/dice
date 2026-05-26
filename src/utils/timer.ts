export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
}

export function parseTime(time: string) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
}
