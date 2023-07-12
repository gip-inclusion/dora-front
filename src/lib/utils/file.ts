export function extractFileName(path: string) {
  return path.split("/").pop();
}
