import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate as classValidate } from "class-validator";

export const validate = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await classValidate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}).join(", "))
        .join("; ");

      res.status(400).json({
        success: false,
        error: messages,
      });
      return;
    }

    req.body = dto;
    next();
  };
};
