import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop({ required: true })
  telegram_id: number;

  @Prop()
  username: string;

  @Prop()
  age: number;

  @Prop({ type: String, enum: ['1', '0'] })
  gender: string;

  @Prop()
  photo_file_id: string;

  @Prop()
  first_name: string;

  @Prop(
    raw({
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [0, 0],
      },
    }),
  )
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ default: Date.now })
  createAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ location: '2dsphere' });
