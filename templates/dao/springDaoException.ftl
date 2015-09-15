package ${pojo.getPackageName()}.dao.exception;  

public class ${pojo.getDeclarationName()}Exception extends DaoException

{
	private static final long serialVersionUID = 1L;
	/**
	 * Method '${pojo.getDeclarationName()}Exception'
	 * 
	 * @param message
	 */
	public ${pojo.getDeclarationName()}Exception(String message)
	{
		super(message);
	}

	/**
	 * Method '${pojo.getDeclarationName()}Exception'
	 * 
	 * @param message
	 * @param cause
	 */
	public ${pojo.getDeclarationName()}Exception(String message, Throwable cause)
	{
		super(message, cause);
	}

}