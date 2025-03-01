import { IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CoreMessage } from 'ai';
class MessageDto {
  @IsNotEmpty() role: string;
  @IsNotEmpty() content: string;
  @IsArray() parts: any[];
}
export class ChatDto {
  @IsNotEmpty() id: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: CoreMessage[];
  @IsNotEmpty() provider: string;
}
