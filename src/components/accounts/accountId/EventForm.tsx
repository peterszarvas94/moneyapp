import { AiFillEdit, AiFillSave, AiOutlineUndo, AiFillDelete, AiOutlineCloseCircle } from "react-icons/ai";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useAccountContext } from "~/context/account";
import { InputNumber } from "./InputNumber";
import { calculatePortion, calculateSaving } from "~/utils/money";
import Payment from "./Payment";
import { useEventContext } from "~/context/event";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { EventDataType } from "~/utils/types";

interface Props {
  onSave: (data: EventDataType) => void,
  onDelete: () => void,
}

export default function EventForm({ onSave, onDelete }: Props) {
  const { access } = useAccountContext();
  const isAdmin = access === "admin";

  const { event, payments, open, setOpen, editing, setEditing } = useEventContext();

  const { name, delivery, income } = event;
  const defaultPayments = payments.map((payment) => ({
    paymentId: payment.id,
    payeeId: payment.payeeId,
    factor: payment.factor,
    extra: payment.extra,
  }));

  const { control, handleSubmit, register, reset, setValue, getValues } = useForm<EventDataType>({
    defaultValues: {
      name,
      income,
      delivery: delivery.toISOString().slice(0, 10),
      saving: 0,
      portion: calculatePortion(0, defaultPayments, income),
      payments: defaultPayments,
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "payments",
  });

  const watchedPayments = useWatch({
    control,
    name: "payments",
  });

  const watchedIncome = useWatch({
    control,
    name: "income",
  });

  const watchedSaving = useWatch({
    control,
    name: "saving",
  });

  const watchedPortion = useWatch({
    control,
    name: "portion",
  });

  useEffect(() => {
    const saving = getValues("saving");
    const newPortion = calculatePortion(saving, watchedPayments, watchedIncome);
    setValue("portion", newPortion);
  }, [watchedSaving, watchedPayments, watchedIncome]);

  return (
    <li className="pb-4">
      <div className="border border-gray-200 rounded-lg">

        {/* event details */}
        <form onSubmit={handleSubmit(onSave)}>
          <ul className="flex flex-col gap-2 pb-2">

            {/* name */}
            <li className="flex justify-between bg-gray-200 rounded-t-inner p-2">
              {editing ? (
                <input
                  className="w-32 h-6 border border-gray-400 rounded px-2"
                  {...register("name")}
                />
              ) : (
                <div className="h-6">{name}</div>
              )}

              {/* buttons */}
              <div className="flex gap-2">

                {isAdmin && !editing && (
                  <>
                    {/* edit button */}
                    <button
                      onClick={async () => setEditing(true)}
                    >
                      <AiFillEdit />
                    </button>

                    {/* delete button */}
                    <button
                      type="button"
                      onClick={() => onDelete()}>
                      <AiFillDelete />
                    </button>
                  </>
                )}

                {/* save button */}
                {isAdmin && editing && (
                  <>
                    <button type="submit">
                      <AiFillSave />
                    </button>

                    {/* undo button */}
                    <button
                      type="button"
                      onClick={() => reset()}
                    >
                      <AiOutlineUndo />
                    </button>

                    {/* cancel button */}
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setEditing(false);
                      }}
                    >
                      <AiOutlineCloseCircle />
                    </button>
                  </>
                )}

                {/* open/close button */}
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </button>
              </div>
            </li>

            {/* delivery */}
            <li className="flex justify-between px-2">
              <div className="h-6">Delivery (mm/dd/yyyy)</div>
              {editing ? (
                <input
                  className="w-32 h-6 border border-gray-400 rounded text-right"
                  type="date"
                  {...register("delivery")}
                />
              ) : (
                <div>{getValues("delivery")}</div>
              )}
            </li>

            {/* income */}
            <li className="flex justify-between px-2">
              <div className="">Income</div>
              {editing ? (
                <Controller
                  name="income"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <InputNumber
                      width="w-32"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )} />
              ) : (
                <div className="w-32 h-6 text-right">
                  {income.toLocaleString("hu")}
                </div>
              )}
            </li>

            {/* open saving & portion */}
            {open && (
              <>
                {/* saving */}
                <li className="flex justify-between px-2">
                  <div className="">Saving</div>
                  {editing ? (
                    <Controller
                      name="saving"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputNumber
                          width="w-32"
                          value={field.value}
                          invalid={field.value < 0}
                          onChange={field.onChange}
                        />
                      )} />

                  ) : (
                    <div className="w-32 h-6 text-right">{getValues("saving").toLocaleString("hu")}</div>
                  )}
                </li>

                {/* portion */}
                <li className="flex justify-between px-2">
                  <div className="">Portion</div>
                  {editing ? (
                    <Controller
                      name="portion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputNumber
                          width="w-32"
                          value={field.value}
                          invalid={field.value < 0}
                          onChange={field.onChange}
                        />
                      )} />
                  ) : (
                    <div className="w-32 h-6 text-right">{getValues("portion").toLocaleString("hu")}</div>
                  )}
                </li>
              </>
            )}
            {/* end: open saving & portion */}
          </ul >
        </form>

        {/* open payments */}
        {open && (
          <>
            <div className="bg-gray-200 p-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
              <div className="">Payee</div>
              <div className="h-6 text-right">Factor</div>
              <div className="h-6 text-right hidden sm:block">Amount</div>
              <div className="h-6 text-right">Extra</div>
              <div className="h-6 text-right">Total</div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 px-2 pt-1 pb-2">
              {fields.map((field, index) => (
                <Controller
                  key={field.id}
                  name={`payments.${index}`}
                  control={control}
                  rules={{ required: true }}
                  defaultValue={field}
                  render={({ field: renderField }) => (
                    <Payment
                      value={{
                        paymentId: renderField.value.paymentId,
                        payeeId: renderField.value.payeeId,
                        factor: renderField.value.factor,
                        extra: renderField.value.extra,
                      }}
                      onChange={renderField.onChange}
                      portion={watchedPortion}
                    />
                  )} />
              ))}
            </div>
          </>
        )}
        {/* end: open payments */}
      </div >
    </li >
  )
}
