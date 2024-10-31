-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a more robust function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql 
AS $$
DECLARE
  username_val TEXT;
  fullname_val TEXT;
BEGIN
  -- Generate a unique username based on email
  username_val := split_part(NEW.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6);
  
  -- Set fullname fallback
  fullname_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Ensure username uniqueness
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_val) LOOP
    username_val := split_part(NEW.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6);
  END LOOP;

  -- Insert new profile with error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      username,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      username_val,
      fullname_val,
      NOW(),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error (you can customize this based on your needs)
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
  END;

  RETURN NEW;
END;
$$;

-- Recreate trigger with explicit schema reference
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();