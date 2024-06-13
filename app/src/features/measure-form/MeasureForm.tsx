import { useState, useEffect } from "react"

import React from 'react';
import { useForm } from 'react-hook-form';

import type { BikeGeometry } from "../../utils/bike-geometry";
import { Wheel } from "../../utils/wheel";
import styles from "./MeasureForm.module.css"

export const MeasureForm = ({ bike }: {bike:BikeGeometry}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form Data Submitted:', data);
  };

  return (
    <div >
        <form onSubmit={handleSubmit(onSubmit)}
            className={styles.formContainer}>
        { Object.keys(bike).map((keyName, i) => (
            keyName!="bbCoordinates" &&
            <div key={keyName}>
                <label 
                    htmlFor={keyName}
                    className={styles.formContainerLabel}>
                    {keyName.charAt(0).toUpperCase() + keyName.slice(1)}:
                </label>
                <input
                    id={keyName}
                    type="text"
                    value={bike[keyName]}
                    className={styles.formContainerInput}
                    {...register(keyName, { required: true })}
                />
                {errors[keyName] && <span>This field is required</span>}
            </div>
        ))}
            <button type="submit">Try This</button>
        </form>
    </div>
  );
};

