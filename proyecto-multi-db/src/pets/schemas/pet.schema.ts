import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ collection: 'pets', timestamps: true })
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  mode: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  size: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  photo: string;

  @Prop({ required: true })
  owner_email: string;

  @Prop({ required: false })
  lat: number;

  @Prop({ required: false })
  lng: number;

  @Prop({ required: false, default: false })
  adopted: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);