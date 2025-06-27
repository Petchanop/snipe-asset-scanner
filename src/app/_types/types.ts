

// export function matchingFieldTypeConverter<TSource, TTarget>(
//     source: TSource,
//     keys: (keyof TTarget)[]
// ): TTarget {
//     const result: Partial<TTarget> = {}
//   for (const key of keys) {
//     if (key in source) {
//       result[key] = source[key]
//     }
//   }
//   return result as TTarget
// }