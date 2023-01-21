import { compose, reduce, modify, map } from "ramda"

/**
 * Modifies a list of fields from the same object with a modify function
 * and returns the new object
 *
 * @func
 * @param {Function} modifyFn The function to run on the value of all fields
 * @param {*} originalObj The original object to modify
 * @param {Array} list The list of fields to modify in the original object
 * @return {*} A new object with the modifications
 * @example
 *
 *      const t = modifyListOfFields(Number)({"foo": "12", "baz":"24"},["foo"])
 *      t //=> {"foo": 12, "baz": "24"}
 */
export const modifyListOfFields = modifyFn => 
                            (originalObj, list) => 
                            reduce((obj,field) => modify(field,modifyFn)(obj), originalObj)(list);


