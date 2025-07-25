import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventDTO, EventDTO, UpdateEventDTO } from "@/api/DTO"; // import your DTO
import styles from "./EventForm.module.scss";
import Button from "@/components/Generic/Button/Button";
import FormInput from "@/components/Generic/Input/FormInput";
import { EventApi } from "@/api/interfaces/event";
import { EventFormSchema } from "@/util/schemas/EventFormSchema";

interface IProps {
  event: EventDTO | undefined;
  modifiedEventCallback: (event: EventDTO) => void;
  toggleModal: () => void;
}

const EventForm: FunctionComponent<IProps> = ({
  event,
  modifiedEventCallback,
  toggleModal,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventDTO>({
    resolver: zodResolver(EventFormSchema),
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        level: event.level,
        day: event.day,
        month: event.month,
        year: event.year,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: CreateEventDTO) => {
    try {
      let ev: EventDTO;
      if (!event) ev = await EventApi.PostEvent(data);
      else
        ev = await EventApi.PutEvent({ ...data } as UpdateEventDTO, event.id);

      if (ev) {
        modifiedEventCallback(ev);
        toggleModal();
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormInput label="Title" {...register("title")} error={errors.title} />
      <FormInput
        type="number"
        label="Level"
        {...register("level", { valueAsNumber: true })}
        error={errors.level}
      />
      <FormInput
        type="number"
        label="Day"
        {...register("day", { valueAsNumber: true })}
        error={errors.day}
      />
      <FormInput
        type="number"
        label="Month"
        {...register("month", { valueAsNumber: true })}
        error={errors.month}
      />
      <FormInput
        type="number"
        label="Year"
        {...register("year", { valueAsNumber: true })}
        error={errors.year}
      />
      <div className={styles.errorMessage}>{errorMessage}</div>
      <div className="buttonContainer">
        <Button label="Submit" type="submit" />
      </div>
    </form>
  );
};

export default EventForm;
