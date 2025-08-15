import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Questioner>;

export class Questioner {
  @Prop({ unique: true })
  telegram_id: number;

  @Prop()
  message: string;

  @Prop({ default: 'public' })
  message_type: ['anonimous', 'public'];

  @Prop({ required: true })
  recipient: [number];

  @Prop({ default: Date.now })
  create_ad: Date;
}

export const QuestionerSchema = SchemaFactory.createForClass(Questioner);
