import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT: number = 3001;

  // Supabase
  @IsUrl()
  @IsNotEmpty()
  SUPABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_ANON_KEY: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Database
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_URL: string;

  // OpenAI
  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY: string;

  @IsString()
  @IsOptional()
  OPENAI_MODEL: string = 'gpt-4-turbo-preview';

  // CORS
  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  
  const errors = validateSync(validatedConfig, { 
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map(error => {
        const constraints = error.constraints;
        return constraints ? Object.values(constraints).join(', ') : '';
      })
      .filter(msg => msg);
    
    throw new Error(`Environment validation failed: ${errorMessages.join('; ')}`);
  }
  
  return validatedConfig;
}