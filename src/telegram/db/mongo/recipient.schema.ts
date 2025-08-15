import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipientDocument = HydratedDocument<Recipient>;

export class Recipient {
  @Prop({ unique: true, required: true })
  telegram_id: number;

  @Prop({ required: true })
  questioner_id: [number];

  @Prop({ default: false })
  isQueue: boolean;

  @Prop({ default: Date.now })
  create_at: Date;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);
