import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsKeyOfClass<T extends object>(
  model: new () => T,
  options?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isKeyOfClass',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          return Object.keys(new model()).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of ${Object.keys(new model()).join(', ')}`;
        },
      },
    });
  };
}
