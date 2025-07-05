import { body, validationResult } from 'express-validator'

const uploadValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required'),

  body('page')
    .notEmpty().withMessage('Page is required')
    .isInt({ gt: 0 }).withMessage('Page must be a positive integer'),

  body('coordinates')
    .notEmpty().withMessage('Coordinates are required')
    .custom(value => {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error();
        }
        if (!('x' in parsed) || !('y' in parsed)) {
          throw new Error('Coordinates must contain x and y');
        }
        if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') {
          throw new Error('x and y must be numbers');
        }
        return true;
      } catch (err) {
        throw new Error(err.message || 'Coordinates must be valid JSON with x and y');
      }
    }),

  body('color')
    .notEmpty().withMessage('Color is required'),

  body('fontSize')
    .notEmpty().withMessage('Font size is required')
    .isInt({ gt: 9, lt: 51 }).withMessage('Font size must be between 10 and 50'),

  body('fontFamily')
    .notEmpty().withMessage('Font family is required')
];

export {
    uploadValidationRules
}