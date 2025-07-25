import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PeriodFormSchema } from "@/util/schemas/PeriodFormSchema";
import { CreatePeriodDTO, PeriodDTO, UpdatePeriodDTO } from "@/api/DTO"; // import your DTO
import styles from "./PeriodForm.module.scss";
import Button from "@/components/Generic/Button/Button";
import FormInput from "@/components/Generic/Input/FormInput";
import { PeriodApi } from "@/api/interfaces/period";

interface IProps {
  period: PeriodDTO | undefined;
  modifiedPeriodCallback: (period: PeriodDTO) => void;
  toggleModal: () => void;
}

const PeriodForm: FunctionComponent<IProps> = ({
  period,
  modifiedPeriodCallback,
  toggleModal,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePeriodDTO>({
    resolver: zodResolver(PeriodFormSchema),
  });

  useEffect(() => {
    if (period) {
      reset({
        title: period.title,
        level: period.level,
        startDay: period.startDay,
        startMonth: period.startMonth,
        startYear: period.startYear,
        endDay: period.endDay,
        endMonth: period.endMonth,
        endYear: period.endYear,
      });
    }
  }, [period, reset]);

  const onSubmit = async (data: CreatePeriodDTO) => {
    try {
      let per: PeriodDTO;
      if (!period) per = await PeriodApi.PostPeriod(data);
      else
        per = await PeriodApi.PutPeriod(
          { ...data } as UpdatePeriodDTO,
          period.id
        );

      if (per) {
        modifiedPeriodCallback(per);
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
        label="Start Day"
        {...register("startDay", { valueAsNumber: true })}
        error={errors.startDay}
      />
      <FormInput
        type="number"
        label="Start Month"
        {...register("startMonth", { valueAsNumber: true })}
        error={errors.startMonth}
      />
      <FormInput
        type="number"
        label="Start Year"
        {...register("startYear", { valueAsNumber: true })}
        error={errors.startYear}
      />

      <FormInput
        type="number"
        label="End Day"
        {...register("endDay", { valueAsNumber: true })}
        error={errors.endDay}
      />
      <FormInput
        type="number"
        label="End Month"
        {...register("endMonth", { valueAsNumber: true })}
        error={errors.endMonth}
      />
      <FormInput
        type="number"
        label="End Year"
        {...register("endYear", { valueAsNumber: true })}
        error={errors.endYear}
      />
      <div className={styles.errorMessage}>{errorMessage}</div>
      <div className="buttonContainer">
        <Button label="Submit" type="submit" />
      </div>
    </form>
  );
};

export default PeriodForm;
