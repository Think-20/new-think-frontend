export class StringHelper {
  static padChar(text: number, size: number = 2) {
    return (text > 0 ? (' ' + String('0').repeat(size) + text).substr( (size * -1), size) : '')
  }
}
