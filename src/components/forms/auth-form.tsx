import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, network } from "@/lib/utils";
import { MailWarning, Eye, EyeOff, ShieldX, Loader2, LogIn } from "lucide-react";
import { Input } from "../ui/input";
import { useAppDispatch } from "@/hooks/use-store";
import { updateToken } from "@/slices/auth-slice";

interface Props {
  logIn?: boolean;
}

const PasswordValidator = z
  .string()
  .min(8, "The password is too short!")
  .max(25, "The password is too long!")
  .regex(/.*\d.*/, "Should contain at least 1 number!")
  .regex(/.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-].*/, "Should contain at least 1 special letter!")
  .regex(/.*[A-Z].*/, "Should contain at least 1 uppercase letter!")
  .regex(/.*[a-z].*/, "Should contain at least 1 lowercase letter!");

const Validator = z.object({
  email: z.string().email(),
  password: PasswordValidator,
});

export const RoleEnum = z.enum(["buyer", "developer", "admin"]).default("buyer");

export const ResponseValidator = z.object({
  data: z.object({
    email: z.string().email(),
    name: z.string(),
    id: z.string(),
    role: RoleEnum,
    token: z.string(),
  }),
  success: z.boolean(),
});

const RegisterSchema = Validator.merge(
  z.object({
    name: z.string().min(3, "Name should be longer!"),
    role: RoleEnum,
  })
);

const getSchema = (signIn: boolean) => {
  if (!signIn) {
    return RegisterSchema;
  }
  return Validator;
};

type FormValidator = z.infer<typeof Validator | typeof RegisterSchema>;

export const AuthForm: React.FC<Props> = ({ logIn = true }) => {
  const [signIn, setSignIn] = React.useState(logIn);
  const [hide, setHide] = React.useState(true);
  const Schema = getSchema(signIn);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValidator>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "buyer",
    },
    resolver: zodResolver(Schema),
  });
  const onSubmit = async (data: FormValidator) => {
    try {
      const response = await network().post(signIn ? "/auth/login" : "/auth/register", data);
      const parsed = await ResponseValidator.spa(response.data);
      if (parsed.success) {
        const { token } = parsed.data.data;
        localStorage.setItem("token", token);
        dispatch(updateToken(token));
      } else {
        console.error(parsed.error);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-xl font-semibold leading-5 tracking-tight">Home Dev</h1>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 sm:rounded sm:px-12 border border-gray-200 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {!signIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your Name"
                    className={cn(
                      "block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                    )}
                    {...register("name")}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={cn(
                    "block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6",
                    {
                      "ring-red-300 focus:ring-red-300": errors.email,
                    }
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <div className="flex items-center h-full mt-1 gap-x-1 ml-1">
                    <MailWarning className="h-5 w-5 text-red-500 mt-2" />
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {errors.email.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <Input
                    type={hide ? "password" : "text"}
                    id="password"
                    autoComplete="current-password"
                    className={cn(
                      "block w-full rounded rounded-r-none border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6",
                      {
                        "ring-red-300 focus:ring-red-300": errors.password,
                      }
                    )}
                    placeholder="••••••••••"
                    {...register("password")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setHide((p) => !p)}
                  className={cn(
                    "relative focus:ring-2 focus:ring-inset focus:ring-gray-700 focus:outline-none -ml-px rounded-none rounded-r inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 duration-150",
                    {
                      "ring-red-300 text-red-600": errors.password,
                    }
                  )}
                >
                  {hide ? (
                    <Eye className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center h-full mt-1 gap-x-1 ml-1">
                  <ShieldX className="h-5 w-5 text-red-500 mt-2" />
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {errors.password.message}
                  </p>
                </div>
              )}
              {!signIn && (
                <div className="mt-4">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Role
                  </label>
                  <div className="mt-2 shadow-sm">
                    <Select
                      defaultValue="buyer"
                      onValueChange={(v: z.infer<typeof RoleEnum>) => setValue("role", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          className="placeholder:text-gray-400"
                          placeholder="Please select a role!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin py-0.5" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {signIn ? "Sign In" : "Register"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          {signIn ? "Not a member?" : "Already a member?"}
          <Button
            variant="link"
            className="font-semibold leading-6 text-gray-800 hover:text-gray-600 -ml-2"
            onClick={() => setSignIn((p) => !p)}
          >
            {signIn ? "Register Now!" : "Log In!"}
          </Button>
        </p>
      </div>
    </div>
  );
};
