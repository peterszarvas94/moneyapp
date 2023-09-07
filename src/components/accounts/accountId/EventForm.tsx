import type { Dispatch, SetStateAction } from "react";
import type { EventDataType, PaymentWithPayee } from "~/utils/types";
import type { Event as EventType, Payee } from "~/server/db/schema";
import { AiFillEdit, AiFillSave, AiOutlineUndo, AiFillDelete, AiOutlineCloseCircle } from "react-icons/ai";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { BsPlusCircleFill } from "react-icons/bs";
import { InputNumber } from "./InputNumber";
import { useAccountContext } from "~/context/account";
import { calculatePortion, calculateSaving } from "~/utils/money";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { parseDate } from "~/utils/date";
import Payment from "./Payment";

interface Props {
  event: EventType,
  payments: PaymentWithPayee[],
  payees: Payee[],
  editing: boolean,
  setEditing: Dispatch<SetStateAction<boolean>>
  onSave: (data: EventDataType) => void,
  onDelete: () => void,
}

export default function EventForm({ event, payments, payees, onSave, onDelete, editing, setEditing }: Props) {
  const { access } = useAccountContext();
  const isAdmin = access === "admin";

  const [open, setOpen] = useState(false);

  const { name, delivery, income, saving } = event;

  const defaultPayments = payments.map((payment) => ({
    paymentId: payment.id,
    payeeId: payment.payeeId,
    factor: payment.factor,
    extra: payment.extra,
  }));

  const defaultDelivery = parseDate(delivery);
  const defaultPortion = useMemo(() => calculatePortion(saving, defaultPayments, [], income), [saving, defaultPayments, income]);

  const defaultValues = {
    name,
    income,
    delivery: defaultDelivery,
    saving,
    portion: defaultPortion,
    payments: defaultPayments,
    newPayments: [],
    deletedPayments: [],
  }

  const { control, handleSubmit, register, reset, setValue, getValues } = useForm<EventDataType>({ defaultValues });

  const { fields: paymentFields, remove: removePayment } = useFieldArray({ control, name: "payments" });
  const { fields: newPaymentFields, append: appendNewPayment, remove: removeNewPayment } = useFieldArray({ control, name: "newPayments" });
  const { append: appendDeletedPayment } = useFieldArray({ control, name: "deletedPayments" });

  const watchedPortion = useWatch({ control, name: "portion" });
  const watchedPayments = useWatch({ control, name: "payments" });
  const watchedNewPayments = useWatch({ control, name: "newPayments" });

  useEffect(() => {
    const newPortion = calculatePortion(getValues("saving") ?? 0, watchedPayments, watchedNewPayments, getValues("income") ?? 0);
    setValue("portion", newPortion);
  }, [watchedPayments, watchedNewPayments]);

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
                      onClick={() => reset(defaultValues)}
                    >
                      <AiOutlineUndo />
                    </button>

                    {/* cancel button */}
                    <button
                      type="button"
                      onClick={() => {
                        reset(defaultValues);
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
              <div className="h-6">Delivery</div>
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
              <div className="h-6">Income</div>
              {editing ? (
                <Controller
                  name="income"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <InputNumber
                      width="w-32"
                      value={field.value}
                      onChange={(newIncome) => {
                        field.onChange(newIncome);
                        const newSaving = calculateSaving(
                          getValues("portion") ?? 0,
                          getValues("payments"),
                          getValues("newPayments"),
                          newIncome ?? 0
                        );
                        setValue("saving", newSaving);
                      }}
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
                          invalid={!!field.value && field.value < 0}
                          onChange={(newSaving) => {
                            field.onChange(newSaving);
                            console.log("new saving", newSaving);
                            const newPortion = calculatePortion(
                              newSaving ?? 0,
                              getValues("payments"),
                              getValues("newPayments"),
                              getValues("income") ?? 0
                            );
                            setValue("portion", newPortion);
                          }}
                        />
                      )} />

                  ) : (
                    <div className="w-32 h-6 text-right">
                      {getValues("saving")?.toLocaleString("hu") ?? 0}
                    </div>
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
                          invalid={!!field.value && field.value < 0}
                          onChange={(newPortion) => {
                            field.onChange(newPortion);
                            const newSaving = calculateSaving(
                              newPortion ?? 0,
                              getValues("payments"),
                              getValues("newPayments"),
                              getValues("income") ?? 0
                            );
                            setValue("saving", newSaving);
                          }}
                        />
                      )} />
                  ) : (
                    <div className="w-32 h-6 text-right">
                      {getValues("portion")?.toLocaleString("hu") ?? 0}
                    </div>
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
              {paymentFields.map((field, index) => (
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
                      portion={watchedPortion ?? 0}
                      editing={editing}
                      payees={payees}
                      onDelete={() => {
                        removePayment(index);
                        appendDeletedPayment(renderField.value);
                      }}
                    />
                  )} />
              ))}
              {newPaymentFields.map((field, index) => (
                <Controller
                  key={field.id}
                  name={`newPayments.${index}`}
                  control={control}
                  rules={{ required: true }}
                  defaultValue={field}
                  render={({ field: renderField }) => (
                    <Payment
                      value={{
                        payeeId: renderField.value.payeeId,
                        factor: renderField.value.factor,
                        extra: renderField.value.extra,
                      }}
                      onChange={renderField.onChange}
                      portion={watchedPortion ?? 0}
                      editing={editing}
                      payees={payees}
                      onDelete={() => removeNewPayment(index)}
                    />
                  )} />
              ))}

              {/* add payment */}
              {editing && (
                <div className="flex gap-1">
                  <button
                    className="text-xl text-green-600"
                    onClick={() => {
                      const payee = payees[0];
                      if (!payee) return;

                      const newPayment = {
                        payeeId: payee.id,
                        factor: 1,
                        extra: 0,
                      };
                      appendNewPayment(newPayment);
                    }}
                  >
                    <BsPlusCircleFill />
                  </button>
                  <div className="h-6 px-1 border border-gray-300 rounded bg-white grow">
                    ...
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {/* end: open payments */}
      </div >
    </li >
  )
}
