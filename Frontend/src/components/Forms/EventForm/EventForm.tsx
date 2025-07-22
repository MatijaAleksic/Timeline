import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventSchema } from "@/util/schemas/CreateEventSchema";
import { CreateEventDTO } from "@/api/DTO"; // import your DTO
import styles from "./EventForm.module.scss";

const EventForm: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventDTO>({
    resolver: zodResolver(CreateEventSchema),
  });

  const onSubmit = (data: CreateEventDTO) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title:</label>
        <input {...register("title")} />
        {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
      </div>

      <div>
        <label>Level:</label>
        <input {...register("level")} />
        {errors.level && <p style={{ color: "red" }}>{errors.level.message}</p>}
      </div>

      <div>
        <label>Day:</label>
        <input type="number" {...register("day", { valueAsNumber: true })} />
        {errors.day && <p style={{ color: "red" }}>{errors.day.message}</p>}
      </div>

      <div>
        <label>Month:</label>
        <input type="number" {...register("month", { valueAsNumber: true })} />
        {errors.month && <p style={{ color: "red" }}>{errors.month.message}</p>}
      </div>

      <div>
        <label>Year:</label>
        <input type="number" {...register("year", { valueAsNumber: true })} />
        {errors.year && <p style={{ color: "red" }}>{errors.year.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EventForm;
